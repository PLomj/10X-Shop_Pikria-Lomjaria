import { useState, type ReactNode } from 'react'
import type { AuthUser } from '../types/auth'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  function login(username: string) {
    const trimmedUsername = username.trim()
    if (!trimmedUsername) return false
    setUser({ username: trimmedUsername })
    return true
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  )
}
