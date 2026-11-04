import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const { pathname, search, hash } = useLocation()

  if (isAuthenticated) return <Outlet />

  return <Navigate to="/login" replace state={{ from: { pathname, search, hash } }} />
}
