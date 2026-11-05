import type { CheckoutFormErrors, CheckoutFormValues } from '../types/checkout'

export const checkoutCountries = [
  { value: 'GE', label: 'Georgia' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'TR', label: 'Türkiye' },
  { value: 'DE', label: 'Germany' },
] as const

export function validateCheckout(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {}
  if (values.fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  const phone = values.phone.trim()
  const digits = phone.replace(/[ -]/g, '').replace(/^\+/, '')
  if (!/^\+?[0-9][0-9 -]*$/.test(phone) || !/^[0-9]{9,15}$/.test(digits)) {
    errors.phone = 'Please enter a valid phone number'
  }
  if (values.address.trim().length < 5) errors.address = 'Address must be at least 5 characters'
  if (!values.city.trim()) errors.city = 'City is required'
  if (!/^[0-9]{4,10}$/.test(values.postalCode.trim())) errors.postalCode = 'Postal code must be 4-10 digits'
  if (!checkoutCountries.some((country) => country.value === values.country)) {
    errors.country = 'Please select a country'
  }
  return errors
}
