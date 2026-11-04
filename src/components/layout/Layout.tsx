import { Outlet } from 'react-router'
import CartProvider from '../../context/CartProvider'
import AuthProvider from '../../context/AuthProvider'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <CartProvider>
      <AuthProvider>
        <div className="flex min-h-dvh flex-col bg-neutral-50 text-neutral-900">
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  )
}
