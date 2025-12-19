import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Top Section - Brand Promise */}
      <div className="footer-top">
        <p className="footer-slogan">
          SeaFresh - Mang hương vị biển cả tươi ngon về ngay căn bếp của bạn
        </p>
      </div>

      {/* Main Footer - 4 Columns */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Column 1: Thông tin */}
          <div className="footer-column">
            <div className="footer-brand">
              <img src="/Logo.png" alt="SeaFresh Logo" className="footer-logo" />
              <h3>SeaFresh</h3>
            </div>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>126 Nguyễn Thiện Thành, P5, Trà Vinh</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <strong>Hotline: 1900 6868</strong>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>support@seafresh.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Hỗ trợ */}
          <div className="footer-column">
            <h4 className="footer-heading">HỖ TRỢ KHÁCH HÀNG</h4>
            <ul className="footer-links">
              <li><Link to="/policy">Chính sách đổi trả</Link></li>
              <li><Link to="/policy">Chính sách giao hàng</Link></li>
              <li><Link to="/checkout">Phương thức thanh toán</Link></li>
              <li><Link to="/guide/seafood">Hướng dẫn chọn hải sản</Link></li>
              <li><Link to="/guide/storage">Bảo quản hải sản</Link></li>
            </ul>
          </div>

          {/* Column 3: Danh mục */}
          <div className="footer-column">
            <h4 className="footer-heading">DANH MỤC</h4>
            <ul className="footer-links">
              <li><Link to="/?category=1">Tôm hùm</Link></li>
              <li><Link to="/?category=2">Cua Cà Mau</Link></li>
              <li><Link to="/?category=3">Cá tươi</Link></li>
              <li><Link to="/?category=4">Mực - Bạch tuộc</Link></li>
              <li><Link to="/?category=5">Sản phẩm đông lạnh</Link></li>
            </ul>
          </div>

          {/* Column 4: Kết nối */}
          <div className="footer-column">
            <h4 className="footer-heading">KẾT NỐI VỚI CHÚNG TÔI</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.787c-.265.706-1.552 1.353-2.263 1.434-.711.081-1.297.036-2.675-.564-1.378-.6-3.624-2.531-4.635-4.192-1.011-1.661-.962-3.206-.753-3.832.209-.626.894-1.353 1.587-1.434.693-.081 1.071.267 1.352.707.281.44 1.11 2.039 1.188 2.214.078.175.156.421.044.656-.112.235-.189.369-.409.627-.22.258-.461.576-.659.774-.22.22-.45.457-.193.863.257.406 1.146 1.844 2.456 2.987 1.681 1.468 3.096 1.927 3.539 2.138.443.211.702.175.961-.106.259-.281.987-1.095 1.245-1.466.258-.371.516-.309.864-.175.348.134 2.21 1.024 2.589 1.213.379.189.631.281.722.44.091.159.091.915-.174 1.621z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>

            <div className="certification">
              <p className="cert-label">Đã thông báo Bộ Công Thương</p>
              <img 
                src="https://theme.hstatic.net/1000182631/1000966139/14/logo-bct.png?v=2440" 
                alt="Bộ Công Thương" 
                className="cert-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2025 SeaFresh. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
