import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/storefront.css';

const NAV_LINKS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/#catalog' },
  { label: 'Câu chuyện', to: '/#story' },
];

const PublicLayout = () => {
  const location = useLocation();

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
          <Link to="/auth?mode=login" className="primary-btn">
            Đăng nhập
          </Link>
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

