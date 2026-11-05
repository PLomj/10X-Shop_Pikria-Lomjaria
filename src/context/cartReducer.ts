import type { CartAction, CartState } from '../types/cart'
import { isCartItem } from '../utils/cartStorage'

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.item
      if (!isCartItem(item)) return state
      const existing = state.items.find((entry) => entry.productId === item.productId)
      const quantity = (existing?.quantity ?? 0) + item.quantity
      if (!Number.isSafeInteger(quantity) || quantity > item.stock) return state
      return {
        ...state,
        items: existing
          ? state.items.map((entry) => entry.productId === item.productId
            ? action.refreshProduct ? { ...item, quantity } : { ...entry, stock: item.stock, quantity }
            : entry)
          : [...state.items, { ...item }],
      }
    }
    case 'SET_QTY': {
      const item = state.items.find((entry) => entry.productId === action.productId)
      if (!item || !Number.isSafeInteger(action.quantity) || action.quantity < 1 ||
        action.quantity > item.stock || action.quantity === item.quantity) return state
      return {
        ...state,
        items: state.items.map((entry) => entry.productId === action.productId
          ? { ...entry, quantity: action.quantity }
          : entry),
      }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((item) => item.productId !== action.productId)
      return items.length === state.items.length ? state : { ...state, items }
    }
    case 'CLEAR':
      return state.items.length === 0 && state.promoCode === null
        ? state : { items: [], promoCode: null }
    case 'APPLY_PROMO': {
      const code = action.code.trim().toUpperCase()
      return code === '10X10' && code !== state.promoCode
        ? { ...state, promoCode: code } : state
    }
    case 'REMOVE_PROMO':
      return state.promoCode === null ? state : { ...state, promoCode: null }
  }
}
