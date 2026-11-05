import type { Order, OrderStatus } from '../types/order'

export function getOrderStatus(order: Order, now: number): OrderStatus {
  const age = Math.max(0, now - Date.parse(order.createdAt))
  if (age < 60000) return 'processing'
  if (age <= 180000) return 'shipped'
  return 'delivered'
}
