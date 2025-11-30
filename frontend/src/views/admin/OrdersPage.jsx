import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getOrders, getOrderById, updateOrder, deleteOrder } from '../../services/adminService';
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: '#f59e0b' },
      processing: { label: 'Đang xử lý', color: '#3b82f6' },
      shipped: { label: 'Đã giao', color: '#8b5cf6' },
      completed: { label: 'Hoàn thành', color: '#10b981' },
      cancelled: { label: 'Đã hủy', color: '#ef4444' },
    };
    const statusInfo = statusMap[status] || { label: status, color: '#6b7280' };
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
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
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

