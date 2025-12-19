import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from './views/AuthPage';
import StorefrontPage from './views/StorefrontPage';
import ProductDetailPage from './views/ProductDetailPage';
import PolicyPage from './views/PolicyPage';
import SupportPage from './views/SupportPage';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import ProductsPage from './views/admin/ProductsPage';
import ProductVariantsPage from './views/admin/ProductVariantsPage';
import AdminOrdersPage from './views/admin/OrdersPage';
import UsersPage from './views/admin/UsersPage';
import CategoriesPage from './views/admin/CategoriesPage';
import VouchersPage from './views/admin/VouchersPage';
import SuppliersPage from './views/admin/SuppliersPage';
import PaymentsPage from './views/admin/PaymentsPage';
import CartsPage from './views/admin/CartsPage';
import ShippingPage from './views/admin/ShippingPage';
import SettingsPage from './views/admin/SettingsPage';
import CustomerLayout from './layouts/CustomerLayout';
import CustomerPortal from './views/CustomerPortal';
import CartPage from './views/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerOrdersPage from './views/OrdersPage';
import ProfilePage from './views/ProfilePage';
import AddressManagementPage from './pages/AddressManagementPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product-variants" element={<ProductVariantsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="carts" element={<CartsPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerPortal />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressManagementPage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<StorefrontPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/policy/:topic" element={<SupportPage />} />
          <Route path="/guide/:topic" element={<SupportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
