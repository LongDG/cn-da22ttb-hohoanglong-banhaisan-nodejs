import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders, getProducts, getUsers, getVouchers } from '../services/adminService';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import apiClient from '../services/apiClient';
import '../styles/admin.css';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('seafresh_user') || '{}'));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
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

  // Fetch default address for customer
  useEffect(() => {
    if (user.role === 'customer' && user.user_id) {
      fetchDefaultAddress();
    }
  }, [user.user_id, user.role]);

  const fetchDefaultAddress = async () => {
    try {
      const response = await apiClient.get(`/api/addresses?userId=${user.user_id}`);
      const addresses = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const defaultAddr = addresses.find(addr => addr.is_default);
      setDefaultAddress(defaultAddr);
    } catch (error) {
      console.error('Fetch default address error:', error);
    }
  };

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

  // Get first letter of name for avatar
  const getAvatarLetter = () => {
    return user.full_name?.charAt(0).toUpperCase() || 'U';
  };

  // Format joined date
  const getJoinedDate = () => {
    if (user.created_at) {
      return new Date(user.created_at).toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return '2024';
  };

  const handleLogout = () => {
    localStorage.removeItem('seafresh_token');
    localStorage.removeItem('seafresh_user');
    navigate('/auth?mode=login');
  };

  const handleUpdateProfile = (updatedUser) => {
    // Update localStorage and state
    const updatedUserData = { ...user, ...updatedUser };
    localStorage.setItem('seafresh_user', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    // Refresh default address after update
    fetchDefaultAddress();
  };

  // If customer, show customer profile
  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* LEFT COLUMN - Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            {getAvatarLetter()}
          </div>
          
          <h2 className="profile-name">{user.full_name || 'Người dùng'}</h2>
          
          <span className="profile-role-badge">Khách hàng</span>
          
          <p className="profile-joined">
            Thành viên từ {getJoinedDate()}
          </p>

          <div className="profile-divider" />

          <div className="profile-stats">
            <div className="stat-item">
              <p className="stat-value">0</p>
              <p className="stat-label">Đơn hàng</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">0</p>
              <p className="stat-label">Đánh giá</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Details Card */}
        <div className="details-card">
          <div className="details-header">
            <h2>Thông tin cá nhân</h2>
            <div className="header-actions">
              <button className="btn-edit" onClick={() => setIsEditModalOpen(true)}>
                Chỉnh sửa thông tin
              </button>
              <button className="btn-change-password" onClick={() => setIsPasswordModalOpen(true)}>
                Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className="details-content">
            <div className="info-grid">
              <div className="info-field">
                <label className="info-label">
                  <span className="info-icon">👤</span>
                  Họ và tên
                </label>
                <input 
                  type="text" 
                  className="info-input" 
                  value={user.full_name || ''} 
                  readOnly 
                  placeholder="Chưa cập nhật"
                />
              </div>

              <div className="info-field">
                <label className="info-label">
                  <span className="info-icon">📧</span>
                  Email
                </label>
                <input 
                  type="email" 
                  className="info-input" 
                  value={user.email || ''} 
                  readOnly 
                />
              </div>

              <div className="info-field">
                <label className="info-label">
                  <span className="info-icon">📱</span>
                  Số điện thoại
                </label>
                <input 
                  type="tel" 
                  className="info-input" 
                  value={user.phone_number || ''} 
                  readOnly 
                  placeholder="Chưa cập nhật"
                />
              </div>

              <div className="info-field">
                <label className="info-label">
                  <span className="info-icon">🆔</span>
                  Mã người dùng
                </label>
                <input 
                  type="text" 
                  className="info-input" 
                  value={user.user_id || ''} 
                  readOnly 
                />
              </div>

              <div className="info-field full-width">
                <label className="info-label">
                  <span className="info-icon">📍</span>
                  Địa chỉ mặc định
                </label>
                <input 
                  type="text" 
                  className="info-input" 
                  value={defaultAddress ? defaultAddress.full_address : ''} 
                  readOnly 
                  placeholder="Chưa có địa chỉ mặc định"
                />
              </div>
            </div>
          </div>

          <div className="details-actions">
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>

      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onUpdate={handleUpdateProfile}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userId={user.user_id}
      />
    </div>
  );
};

export default ProfilePage;

