import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getOrders, getOrderById, updateOrder, deleteOrder, completeCODOrder } from '../../services/adminService';
import '../../styles/admin.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    shipping_address: '',
    notes: '',
    payment_status: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const res = await getOrderById(order.order_id);
      setOrderDetails(res.data);
      setSelectedOrder(order);
      setFormData({
        status: order.status,
        shipping_address: order.shipping_address,
        notes: order.notes || '',
        payment_status: order.payment_status,
      });
      setModalOpen(true);
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(selectedOrder.order_id, formData);
      handleCloseModal();
      fetchOrders();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng #${order.order_id}?`)) {
      return;
    }
    try {
      await deleteOrder(order.order_id);
      fetchOrders();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleCompleteCOD = async () => {
    if (!selectedOrder) return;
    
    if (!window.confirm(`Xác nhận đã thu tiền và hoàn tất đơn COD #${selectedOrder.order_id}?`)) {
      return;
    }

    try {
      await completeCODOrder(selectedOrder.order_id);
      alert('Đã hoàn tất đơn COD thành công!');
      handleCloseModal();
      fetchOrders();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: '#f59e0b' },
      processing: { label: 'Đang xử lý', color: '#3b82f6' },
      shipped: { label: 'Đã giao', color: '#8b5cf6' },
      completed: { label: 'Hoàn thành', color: '#10b981' },
      cancelled: { label: 'Đã hủy', color: '#ef4444' },
      'Chờ xác nhận': { label: 'Chờ xác nhận', color: '#f59e0b' },
      'Chờ giao': { label: 'Chờ giao', color: '#3b82f6' },
      'Hoàn tất': { label: 'Hoàn tất', color: '#10b981' },
    };
    const statusInfo = statusMap[status] || { label: status, color: '#6b7280' };
    return (
      <span className="status-badge" style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}>
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (!paymentStatus) return null;
    const statusMap = {
      'Chưa thanh toán': { label: 'Chưa thanh toán', color: '#ef4444' },
      'Đã thanh toán': { label: 'Đã thanh toán', color: '#10b981' },
      pending: { label: 'Chưa thanh toán', color: '#ef4444' },
      successful: { label: 'Đã thanh toán', color: '#10b981' },
    };
    const statusInfo = statusMap[paymentStatus] || { label: paymentStatus, color: '#6b7280' };
    return (
      <span className="status-badge" style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}>
        {statusInfo.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const columns = [
    { header: 'Mã đơn', accessor: 'order_id' },
    { header: 'Người dùng', accessor: 'user_id' },
    { 
      header: 'Ngày đặt', 
      accessor: 'order_date',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
    { 
      header: 'Trạng thái', 
      accessor: 'status',
      render: (val) => getStatusBadge(val)
    },
    { 
      header: 'Tổng tiền', 
      accessor: 'total_amount',
      render: (val) => formatCurrency(val || 0)
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý đơn hàng</h2>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        onEdit={handleViewDetails}
        onDelete={handleDelete}
        emptyMessage="Chưa có đơn hàng nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`Chi tiết đơn hàng #${selectedOrder?.order_id}`}
        size="large"
      >
        {orderDetails && (
          <div className="order-details">
            <div className="order-info-section">
              <h4>Thông tin đơn hàng</h4>
              <div className="info-grid">
                <div>
                  <label>Mã đơn:</label>
                  <span>{orderDetails.order_id}</span>
                </div>
                <div>
                  <label>Người dùng:</label>
                  <span>{orderDetails.user_id}</span>
                </div>
                <div>
                  <label>Ngày đặt:</label>
                  <span>{new Date(orderDetails.order_date).toLocaleString('vi-VN')}</span>
                </div>
                <div>
                  <label>Tổng tiền:</label>
                  <span>{formatCurrency(orderDetails.total_amount)}</span>
                </div>
                <div>
                  <label>Phí vận chuyển:</label>
                  <span>{formatCurrency(orderDetails.shipping_fee || 0)}</span>
                </div>
                <div>
                  <label>Giảm giá:</label>
                  <span>{formatCurrency(orderDetails.discount_amount || 0)}</span>
                </div>
                <div>
                  <label>Phương thức thanh toán:</label>
                  <span>{orderDetails.payment_method || 'COD'}</span>
                </div>
                <div>
                  <label>Trạng thái thanh toán:</label>
                  <span>{getPaymentStatusBadge(orderDetails.payment_status)}</span>
                </div>
              </div>
            </div>

            {orderDetails.items && orderDetails.items.length > 0 && (
              <div className="order-items-section">
                <h4>Chi tiết sản phẩm</h4>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Mã biến thể</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.variant_id}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price_at_purchase)}</td>
                        <td>{formatCurrency(item.price_at_purchase * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <form onSubmit={handleUpdate} className="admin-form">
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="Chờ giao">Chờ giao</option>
                  <option value="shipped">Đã giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="Hoàn tất">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái thanh toán</label>
                <select
                  value={formData.payment_status || ''}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Chưa thanh toán">Chưa thanh toán</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                </select>
              </div>

              <div className="form-group">
                <label>Địa chỉ giao hàng</label>
                <textarea
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                {orderDetails.payment_method === 'COD' && 
                 orderDetails.payment_status !== 'Đã thanh toán' && 
                 orderDetails.payment_status !== 'successful' && (
                  <button 
                    type="button" 
                    className="btn-success"
                    onClick={handleCompleteCOD}
                    style={{ backgroundColor: '#10b981', color: 'white', marginRight: '8px' }}
                  >
                    ✅ Hoàn tất đơn COD
                  </button>
                )}
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Đóng
                </button>
                <button type="submit" className="btn-primary">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;

