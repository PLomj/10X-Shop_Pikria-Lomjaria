const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(price: number) {
  return usd.format(price)
}

export function priceInCents(price: number) {
  return Math.round(price * 100)
}

export function lineSubtotal(price: number, quantity: number) {
  return priceInCents(price) * quantity / 100
}
