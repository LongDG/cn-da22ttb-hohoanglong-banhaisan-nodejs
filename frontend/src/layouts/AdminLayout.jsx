import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/admin.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('seafresh_token');
    localStorage.removeItem('seafresh_user');
    navigate('/auth');
  };

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: '📊' },
    { path: '/admin/products', label: 'Sản phẩm', icon: '🦐' },
    { path: '/admin/orders', label: 'Đơn hàng', icon: '📦' },
    { path: '/admin/carts', label: 'Giỏ hàng', icon: '🛒' },
    { path: '/admin/users', label: 'Người dùng', icon: '👥' },
    { path: '/admin/categories', label: 'Danh mục', icon: '📁' },
    { path: '/admin/vouchers', label: 'Voucher', icon: '🎫' },
    { path: '/admin/suppliers', label: 'Nhà cung cấp', icon: '🏭' },
    { path: '/admin/payments', label: 'Thanh toán', icon: '💳' },
    { path: '/admin/shipping', label: 'Phí Ship', icon: '🚚' },
    { path: '/admin/settings', label: 'Cấu hình', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <span className="logo-icon">🌊</span>
            <span className="logo-text">Admin Panel</span>
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <span className="nav-icon">🏠</span>
            {sidebarOpen && <span className="nav-label">Về trang chủ</span>}
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-label">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-page-title">
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h1>
            <div className="admin-user-info">
              <span className="user-name">{user.full_name || user.email}</span>
              <span className="user-role">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

