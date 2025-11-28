import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from './views/AuthPage';
import StorefrontPage from './views/StorefrontPage';
import ProductDetailPage from './views/ProductDetailPage';
import PublicLayout from './layouts/PublicLayout';
import AdminDashboard from './views/AdminDashboard';
import CustomerLayout from './layouts/CustomerLayout';
import CustomerPortal from './views/CustomerPortal';
import OrdersPage from './views/OrdersPage';
import ProfilePage from './views/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerPortal />} />
          <Route path="orders" element={<OrdersPage />} />
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
