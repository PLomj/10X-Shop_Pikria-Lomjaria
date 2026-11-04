export interface AuthUser {
  username: string
}

export interface LoginFormValues {
  username: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string) => boolean
  logout: () => void
}
