import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CartBadge from '../components/CartBadge';
import '../styles/storefront.css';

const NAV_LINKS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/#catalog' },
  { label: 'Câu chuyện', to: '/#story' },
];

const PublicLayout = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('seafresh_token');
      const userStr = localStorage.getItem('seafresh_user');
      const userData = userStr ? JSON.parse(userStr) : null;
      
      setIsLoggedIn(!!token && !!userData);
      setUser(userData);
    };

    checkAuth();
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('seafresh_token');
    localStorage.removeItem('seafresh_user');
    setIsLoggedIn(false);
    setUser(null);
    setAccountMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <div className="public-layout">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">SeaFresh</span>
          <p>Tươi ngon mỗi ngày</p>
        </div>

        <nav>
          {NAV_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {/* Giỏ hàng: icon + badge (giữ CartBadge) */}
          <CartBadge />
          {isLoggedIn ? (
            <>
              {/* Tài khoản: icon tròn với dropdown */}
              <div className="account-wrapper">
                <button
                  className="icon-btn tooltip"
                  data-label="Tài khoản"
                  aria-label="Tài khoản"
                  title="Tài khoản"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="3.5" stroke="#cbd5f5" strokeWidth="1.8"/>
                    <path d="M4.5 19c1.8-3.5 5.3-5 7.5-5s5.7 1.5 7.5 5" stroke="#cbd5f5" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
                {accountMenuOpen && (
                  <div className="account-dropdown">
                    {/* Khu vực 1: User Header */}
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
                      </div>
                      <div className="dropdown-user-info">
                        <div className="dropdown-user-name">
                          {user?.full_name || 'Người dùng'}
                        </div>
                        <div className="dropdown-user-email">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    {/* Khu vực 2: Cá nhân */}
                    <div className="dropdown-section">
                      <Link
                        to="/customer/profile"
                        className="dropdown-item"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <span className="dropdown-icon">👤</span>
                        Tài khoản
                      </Link>
                      <Link
                        to="/customer/orders"
                        className="dropdown-item"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <span className="dropdown-icon">📦</span>
                        Đơn hàng của tôi
                      </Link>
                    </div>

                    {/* Khu vực 3: Quản trị (chỉ hiện nếu là admin) */}
                    {user?.role === 'admin' && (
                      <>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-section">
                          <Link
                            to="/admin"
                            className="dropdown-item admin-link"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <span className="dropdown-icon">⚙️</span>
                            Quay lại trang Admin
                          </Link>
                        </div>
                      </>
                    )}

                    <div className="dropdown-divider"></div>

                    {/* Khu vực 4: Đăng xuất */}
                    <div className="dropdown-section">
                      <button
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <span className="dropdown-icon">🚪</span>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/auth?mode=login" className="primary-btn">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      <Outlet />

      <footer className="site-footer" id="story">
        <div>
          <h4>SeaFresh</h4>
          <p>Hải sản được đánh bắt và vận chuyển trong 24 giờ.</p>
        </div>
        <div>
          <p>Hotline</p>
          <strong>1900 6868</strong>
        </div>
        <div>
          <p>Email</p>
          <strong>support@seafresh.vn</strong>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

