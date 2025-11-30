import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from './views/AuthPage';
import StorefrontPage from './views/StorefrontPage';
import ProductDetailPage from './views/ProductDetailPage';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import ProductsPage from './views/admin/ProductsPage';
import AdminOrdersPage from './views/admin/OrdersPage';
import UsersPage from './views/admin/UsersPage';
import CategoriesPage from './views/admin/CategoriesPage';
import VouchersPage from './views/admin/VouchersPage';
import SuppliersPage from './views/admin/SuppliersPage';
import PaymentsPage from './views/admin/PaymentsPage';
import CartsPage from './views/admin/CartsPage';
import CustomerLayout from './layouts/CustomerLayout';
import CustomerPortal from './views/CustomerPortal';
import CartPage from './views/CartPage';
import CustomerOrdersPage from './views/OrdersPage';
import ProfilePage from './views/ProfilePage';
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
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="carts" element={<CartsPage />} />
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
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<StorefrontPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
