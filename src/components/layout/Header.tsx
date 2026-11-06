import { Link, NavLink } from 'react-router'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Catalog' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
  { to: '/login', label: 'Login' },
]

export default function Header() {
  const { cartItemCount } = useCart()
  const { user, logout } = useAuth()
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-4">
          10X Shop
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-1">
            {links.filter(({ to }) => user ? to !== '/login' : to !== '/profile').map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isActive ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`
                  }
                >
                  {to === '/cart' ? `Cart (${cartItemCount})` : label}
                </NavLink>
              </li>
            ))}
            {user && (
              <li className="flex max-w-full flex-wrap items-center gap-2 px-2 text-sm">
                <span className="min-w-0 break-all">Signed in as {user.username}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md px-3 py-2 font-medium underline underline-offset-4 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
