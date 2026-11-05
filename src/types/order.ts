import type { OrderConfirmation } from './checkout'

export type Order = OrderConfirmation

export type OrderStatus = 'processing' | 'shipped' | 'delivered'

export interface OrderRecordIssue {
  index: number
  code: 'invalid-record' | 'duplicate-reference' | 'conflicting-reference'
}

export interface OrderStorageError {
  code:
    | 'storage-unavailable'
    | 'malformed-json'
    | 'invalid-root'
    | 'corrupt-history'
    | 'invalid-order'
    | 'reference-conflict'
    | 'quota-exceeded'
    | 'write-failed'
  message: string
}

export type LoadOrdersResult =
  | { status: 'success'; orders: Order[] }
  | { status: 'partial'; orders: Order[]; issues: OrderRecordIssue[] }
  | { status: 'error'; error: OrderStorageError }

export type SaveOrderResult =
  | { status: 'success'; outcome: 'saved' | 'already-exists' }
  | { status: 'error'; error: OrderStorageError }
