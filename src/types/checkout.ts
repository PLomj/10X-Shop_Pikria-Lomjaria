import type { CartItem, CartSummary } from './cart'

export interface CheckoutFormValues {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>

export interface OrderItemSnapshot extends Pick<CartItem,
  'productId' | 'title' | 'price' | 'discountPercentage' | 'quantity'> {
  unitPrice: number
  lineTotal: number
}

export interface OrderConfirmation {
  reference: string
  createdAt: string
  customer: Pick<CheckoutFormValues, 'fullName' | 'email' | 'phone'>
  shippingAddress: Pick<CheckoutFormValues, 'address' | 'city' | 'postalCode' | 'country'>
  items: OrderItemSnapshot[]
  promoCode: string | null
  summary: CartSummary
}
