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

export interface OrderConfirmation {
  reference: string
  customerName: string
  total: number
}
