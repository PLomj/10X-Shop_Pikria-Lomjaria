const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(price: number) {
  return usd.format(price)
}

export function priceInCents(price: number) {
  return Math.round(price * 100)
}

export function discountedPrice(price: number, discountPercentage = 0) {
  const discount = Number.isFinite(discountPercentage) && discountPercentage > 0 &&
    discountPercentage <= 100 ? discountPercentage : 0
  return priceInCents(price * (1 - discount / 100)) / 100
}

export function lineSubtotal(price: number, quantity: number, discountPercentage?: number) {
  return priceInCents(discountedPrice(price, discountPercentage)) * quantity / 100
}
