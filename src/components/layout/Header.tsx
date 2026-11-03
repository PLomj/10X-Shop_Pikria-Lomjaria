import { Link, NavLink } from 'react-router'

const links = [
  { to: '/', label: 'Catalog' },
  { to: '/cart', label: 'Cart' },
  { to: '/login', label: 'Login' },
]

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-4">
          10X Shop
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-1">
            {links.map(({ to, label }) => (
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
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
