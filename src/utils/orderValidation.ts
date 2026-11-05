import type { CartSummary } from '../types/cart'
import type { OrderItemSnapshot } from '../types/checkout'
import type { Order } from '../types/order'
import { discountedPrice, lineSubtotal, priceInCents } from './currency'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 &&
    Number.isSafeInteger(priceInCents(value))
}

function isMoney(value: unknown): value is number {
  return isPrice(value) && value === priceInCents(value) / 100
}

function isTimestamp(value: unknown): value is string {
  if (typeof value !== 'string') return false
  // Accept ISO timestamps with explicit zones, including toISOString's extended years.
  const match = /^(\d{4}|[+-]\d{6})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value)
  if (!match || !Number.isFinite(Date.parse(value))) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]
}

function isOrderItem(value: unknown): value is OrderItemSnapshot {
  if (!isRecord(value)) return false
  return typeof value.productId === 'number' && Number.isSafeInteger(value.productId) &&
    value.productId > 0 && isText(value.title) &&
    typeof value.quantity === 'number' && Number.isSafeInteger(value.quantity) && value.quantity > 0 &&
    isPrice(value.price) &&
    (value.discountPercentage === undefined ||
      (typeof value.discountPercentage === 'number' && Number.isFinite(value.discountPercentage))) &&
    isMoney(value.unitPrice) && isMoney(value.lineTotal) &&
    Number.isSafeInteger(priceInCents(value.unitPrice) * value.quantity) &&
    value.unitPrice === discountedPrice(value.price, value.discountPercentage) &&
    value.lineTotal === lineSubtotal(value.price, value.quantity, value.discountPercentage)
}

function isSummary(value: unknown): value is CartSummary {
  return isRecord(value) && isMoney(value.subtotal) && isMoney(value.discount) &&
    isMoney(value.shipping) && isMoney(value.total)
}

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value) || !isText(value.reference) || !isTimestamp(value.createdAt) ||
    !isRecord(value.customer) || !isRecord(value.shippingAddress)) return false
  const customer = value.customer
  const address = value.shippingAddress
  if (!['fullName', 'email', 'phone'].every((key) => isText(customer[key])) ||
    !['address', 'city', 'postalCode', 'country'].every((key) => isText(address[key])) ||
    !Array.isArray(value.items) || value.items.length === 0 || !value.items.every(isOrderItem) ||
    (value.promoCode !== null && value.promoCode !== '10X10') || !isSummary(value.summary)) return false

  const ids = new Set(value.items.map((item) => item.productId))
  if (ids.size !== value.items.length) return false
  const subtotal = value.items.reduce((sum, item) => sum + priceInCents(item.lineTotal), 0)
  const discount = priceInCents(value.summary.discount)
  const shipping = priceInCents(value.summary.shipping)
  const total = subtotal - discount + shipping
  // Validate historical arithmetic, not today's promo rates or shipping thresholds.
  return Number.isSafeInteger(subtotal) && Number.isSafeInteger(total) && discount <= subtotal &&
    subtotal === priceInCents(value.summary.subtotal) && total === priceInCents(value.summary.total)
}

// Copy only snapshot fields; no ownership, payment data, or derived status is added.
export function copyOrder(order: Order): Order {
  return {
    reference: order.reference,
    createdAt: order.createdAt,
    customer: {
      fullName: order.customer.fullName, email: order.customer.email, phone: order.customer.phone,
    },
    shippingAddress: {
      address: order.shippingAddress.address, city: order.shippingAddress.city,
      postalCode: order.shippingAddress.postalCode, country: order.shippingAddress.country,
    },
    items: order.items.map((item) => ({
      productId: item.productId, title: item.title, price: item.price,
      discountPercentage: item.discountPercentage, quantity: item.quantity,
      unitPrice: item.unitPrice, lineTotal: item.lineTotal,
    })),
    promoCode: order.promoCode,
    summary: {
      subtotal: order.summary.subtotal, discount: order.summary.discount,
      shipping: order.summary.shipping, total: order.summary.total,
    },
  }
}

export function ordersEqual(left: Order, right: Order): boolean {
  // Normalize time only in temporary comparison data, never in persisted snapshots.
  return JSON.stringify({ ...copyOrder(left), createdAt: Date.parse(left.createdAt) }) ===
    JSON.stringify({ ...copyOrder(right), createdAt: Date.parse(right.createdAt) })
}
