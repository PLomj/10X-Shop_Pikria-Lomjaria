import type { LoadOrdersResult, Order, OrderRecordIssue, SaveOrderResult } from '../types/order'
import { copyOrder, isOrder, ordersEqual } from './orderValidation'

// Browser-shared educational history, not secure per-user storage.
// Read-modify-write is not transactional across tabs. Never repair corrupt history here.
const storageKey = 'shop_orders'

function readHistory(): { result: LoadOrdersResult; records: unknown[] } {
  let saved: string | null
  try {
    saved = localStorage.getItem(storageKey)
  } catch {
    return {
      result: { status: 'error', error: { code: 'storage-unavailable', message: 'Order storage is unavailable.' } },
      records: [],
    }
  }
  if (saved === null) return { result: { status: 'success', orders: [] }, records: [] }
  let data: unknown
  try {
    data = JSON.parse(saved)
  } catch {
    return {
      result: { status: 'error', error: { code: 'malformed-json', message: 'Stored order history contains unreadable JSON.' } },
      records: [],
    }
  }
  if (!Array.isArray(data)) {
    return {
      result: { status: 'error', error: { code: 'invalid-root', message: 'Stored order history must be an array.' } },
      records: [],
    }
  }
  const byReference = new Map<string, Order>()
  const issues: OrderRecordIssue[] = []
  data.forEach((record: unknown, index: number) => {
    if (!isOrder(record)) {
      issues.push({ index, code: 'invalid-record' })
      return
    }
    const previous = byReference.get(record.reference)
    if (previous) {
      issues.push({ index, code: ordersEqual(previous, record) ? 'duplicate-reference' : 'conflicting-reference' })
    } else {
      byReference.set(record.reference, copyOrder(record))
    }
  })
  const orders = [...byReference.values()].sort((left, right) =>
    Date.parse(right.createdAt) - Date.parse(left.createdAt) ||
    (left.reference < right.reference ? -1 : left.reference > right.reference ? 1 : 0))
  return {
    result: issues.length ? { status: 'partial', orders, issues } : { status: 'success', orders },
    records: data,
  }
}

export function loadOrders(): LoadOrdersResult {
  return readHistory().result
}

export function saveOrder(order: unknown): SaveOrderResult {
  if (!isOrder(order)) {
    return { status: 'error', error: { code: 'invalid-order', message: 'The order snapshot is invalid.' } }
  }
  const { result, records } = readHistory()
  if (result.status === 'error') return result
  if (result.status === 'partial') {
    return { status: 'error', error: { code: 'corrupt-history', message: 'Order history contains invalid or duplicate records. Saving is blocked to preserve it.' } }
  }
  const previous = result.orders.find((entry) => entry.reference === order.reference)
  if (previous) {
    return ordersEqual(previous, order)
      ? { status: 'success', outcome: 'already-exists' }
      : { status: 'error', error: { code: 'reference-conflict', message: 'An order with this reference already contains different data.' } }
  }
  try {
    // Preserve existing valid records verbatim as data, including createdAt strings.
    localStorage.setItem(storageKey, JSON.stringify([...records, copyOrder(order)]))
    return { status: 'success', outcome: 'saved' }
  } catch (error) {
    const quotaExceeded = typeof error === 'object' && error !== null &&
      'name' in error && error.name === 'QuotaExceededError'
    return {
      status: 'error',
      error: quotaExceeded
        ? { code: 'quota-exceeded', message: 'Order storage is full. The order could not be saved.' }
        : { code: 'write-failed', message: 'The order could not be written to storage.' },
    }
  }
}
