export interface CheckoutFormValues {
  fullName: string
  email: string
  address: string
  city: string
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>

export interface OrderConfirmation {
  reference: string
  customerName: string
  total: number
}
