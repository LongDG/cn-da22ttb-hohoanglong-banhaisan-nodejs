import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getProducts, getUsers, getVouchers } from '../services/adminService';
import '../styles/admin.css';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalVouchers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    loading: true,
  });

  useEffect(() => {
    // Only fetch stats if user is admin
    if (user.role !== 'admin') {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes, vouchersRes] = await Promise.all([
          getOrders(),
          getProducts(),
          getUsers(),
          getVouchers(),
        ]);

        const orders = ordersRes.data || [];
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const processingOrders = orders.filter(o => o.status === 'processing').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;

        setStats({
          totalOrders: orders.length,
          totalProducts: productsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          totalVouchers: vouchersRes.data?.length || 0,
          pendingOrders,
          processingOrders,
          completedOrders,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [user.role]);

  // If admin, show admin dashboard
  if (user.role === 'admin') {
    const statCards = [
      {
        title: 'Tổng đơn hàng',
        value: stats.totalOrders,
        icon: '📦',
        color: '#3b82f6',
        link: '/admin/orders',
      },
      {
        title: 'Tổng sản phẩm',
        value: stats.totalProducts,
        icon: '🦐',
        color: '#10b981',
        link: '/admin/products',
      },
      {
        title: 'Tổng người dùng',
        value: stats.totalUsers,
        icon: '👥',
        color: '#8b5cf6',
        link: '/admin/users',
      },
      {
        title: 'Tổng voucher',
        value: stats.totalVouchers,
        icon: '🎫',
        color: '#f59e0b',
        link: '/admin/vouchers',
      },
    ];

    const orderStatusCards = [
      {
        title: 'Đơn chờ xử lý',
        value: stats.pendingOrders,
        color: '#f59e0b',
      },
      {
        title: 'Đang xử lý',
        value: stats.processingOrders,
        color: '#3b82f6',
      },
      {
        title: 'Hoàn thành',
        value: stats.completedOrders,
        color: '#10b981',
      },
    ];

    return (
      <main className="admin-dashboard">
        <section className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Chào mừng quay trở lại, {user.full_name}</p>
          </div>
        </section>

        {stats.loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            <section className="stats-grid">
              {statCards.map(card => (
                <Link key={card.title} to={card.link} style={{ textDecoration: 'none' }}>
                  <div className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
                    <div className="stat-card-icon">{card.icon}</div>
                    <div className="stat-card-content">
                      <h3>{card.title}</h3>
                      <p className="stat-card-value">{card.value}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </section>

            <section className="order-status-cards">
              <h2>Trạng thái đơn hàng</h2>
              <div className="status-grid">
                {orderStatusCards.map(card => (
                  <div key={card.title} className="status-card" style={{ borderTop: `4px solid ${card.color}` }}>
                    <h3>{card.title}</h3>
                    <p className="status-value">{card.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="quick-links">
              <h2>Quản lý nhanh</h2>
              <div className="links-grid">
                <Link to="/admin/products" className="quick-link-btn">📝 Quản lý sản phẩm</Link>
                <Link to="/admin/orders" className="quick-link-btn">📦 Quản lý đơn hàng</Link>
                <Link to="/admin/users" className="quick-link-btn">👥 Quản lý người dùng</Link>
                <Link to="/admin/payments" className="quick-link-btn">💳 Quản lý thanh toán</Link>
                <Link to="/admin/categories" className="quick-link-btn">🏷️ Quản lý danh mục</Link>
                <Link to="/admin/vouchers" className="quick-link-btn">🎫 Quản lý voucher</Link>
              </div>
            </section>
          </>
        )}
      </main>
    );
  }

  // If customer, show customer profile
  return (
    <section className="profile-section">
      <h1>Thông tin tài khoản</h1>
      <div className="profile-info">
        <ul>
          <li>
            <strong>Họ tên:</strong> {user.full_name || 'Chưa cập nhật'}
          </li>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
          <li>
            <strong>Số điện thoại:</strong> {user.phone_number || 'Chưa cập nhật'}
          </li>
          <li>
            <strong>Vai trò:</strong> Khách hàng
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ProfilePage;

