import { Route, Routes } from 'react-router'
import Layout from '../components/layout/Layout'
import CatalogPage from '../pages/CatalogPage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import CartPage from '../pages/CartPage'
import LoginPage from '../pages/LoginPage'
import CheckoutPage from '../pages/CheckoutPage'
import OrdersPage from '../pages/OrdersPage'
import OrderDetailsPage from '../pages/OrderDetailsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
