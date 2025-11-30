import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getProducts, getUsers, getVouchers } from '../../services/adminService';
import '../../styles/admin.css';

const AdminDashboard = () => {
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
  }, []);

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

  if (stats.loading) {
    return (
      <div className="admin-loading">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Tổng quan hệ thống</h2>
        <p>Chào mừng trở lại! Dưới đây là thống kê tổng quan của hệ thống.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: `${card.color}20` }}>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div className="stat-card-content">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Trạng thái đơn hàng</h3>
        <div className="order-status-grid">
          {orderStatusCards.map((card, index) => (
            <div key={index} className="order-status-card" style={{ borderLeftColor: card.color }}>
              <h4>{card.title}</h4>
              <p className="order-status-value" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Thao tác nhanh</h3>
        <div className="quick-actions">
          <Link to="/admin/products" className="quick-action-btn">
            <span>➕</span>
            <span>Tạo sản phẩm mới</span>
          </Link>
          <Link to="/admin/vouchers" className="quick-action-btn">
            <span>🎫</span>
            <span>Tạo voucher mới</span>
          </Link>
          <Link to="/admin/categories" className="quick-action-btn">
            <span>📁</span>
            <span>Quản lý danh mục</span>
          </Link>
          <Link to="/admin/orders" className="quick-action-btn">
            <span>📦</span>
            <span>Xem đơn hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

