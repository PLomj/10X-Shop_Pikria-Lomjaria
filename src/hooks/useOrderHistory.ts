import { useEffect, useState } from 'react'
import { loadOrders } from '../utils/orderStorage'

export default function useOrderHistory() {
  const [history, setHistory] = useState(loadOrders)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(interval)
  }, [])

  function retry() {
    setHistory(loadOrders())
    setNow(Date.now())
  }

  return { history, now, retry }
}
