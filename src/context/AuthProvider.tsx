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

  function updateUsername(username: string): boolean {
    const trimmedUsername = username.trim()
    if (!user || !trimmedUsername) return false

    setUser((currentUser) => {
      if (!currentUser || currentUser.username === trimmedUsername) {
        return currentUser
      }

      return { ...currentUser, username: trimmedUsername }
    })

    return true
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, updateUsername, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  )
}
