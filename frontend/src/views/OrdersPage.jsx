import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import '../styles/OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  useEffect(() => {
    if (user.user_id) {
      fetchOrders();
    }
  }, [user.user_id]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/api/orders?userId=${user.user_id}`);
      const ordersData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      // Sort by created date descending
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Fetch orders error:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipping': 'status-shipping',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusClassMap[status] || '';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa cập nhật';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Chưa cập nhật';
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBuyAgain = (order) => {
    // Logic to add order items back to cart
    console.log('Mua lại đơn hàng:', order.order_id);
    // TODO: Implement add to cart functionality
  };

  // Filter orders by status
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  // Get count for each status
  const getStatusCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'completed', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  if (isLoading) {
    return (
      <div className="orders-page">
        <h1>Đơn hàng của tôi</h1>
        <p className="loading-text">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Đơn hàng của tôi</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>Bạn chưa có đơn hàng nào</p>
          <a href="/" className="btn-shopping">Tiếp tục mua sắm</a>
        </div>
      ) : (
        <>
          {/* Status Tabs */}
          <div className="order-tabs">
            {statusTabs.map(tab => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="tab-count">({getStatusCount(tab.key)})</span>
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="empty-tab">
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-date">{formatDate(order.created_at)}</span>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Người nhận:</span>
                  <span className="detail-value">{order.shipping_address?.recipient_name || 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Điện thoại:</span>
                  <span className="detail-value">{order.shipping_address?.phone_number || 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Địa chỉ:</span>
                  <span className="detail-value">{order.shipping_address?.full_address || 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phương thức thanh toán:</span>
                  <span className="detail-value">
                    {order.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                  </span>
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Tổng tiền:</span>
                  <strong>{formatPrice(order.total_amount)}</strong>
                </div>
                <button 
                  className="btn-buy-again"
                  onClick={() => handleBuyAgain(order)}
                >
                  Mua lại
                </button>
              </div>
            </div>
          ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;

