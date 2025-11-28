import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/customer.css';

const CustomerLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('seafresh_user');
    localStorage.removeItem('seafresh_token');
    navigate('/auth?mode=login', { replace: true });
  };

  return (
    <div className="customer-shell">
      <aside className="customer-sidebar">
        <div className="brand">
          <Link to="/">SeaFresh</Link>
          <p>{user.full_name || user.email}</p>
        </div>

        <nav>
          <NavLink end to="/customer">
            Tổng quan
          </NavLink>
          <NavLink to="/customer/orders">
            Đơn hàng
          </NavLink>
          <NavLink to="/customer/profile">
            Tài khoản
          </NavLink>
        </nav>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      <main className="customer-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;

