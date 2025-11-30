import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getPayments, createPayment, updatePayment, deletePayment } from '../../services/adminService';
import '../../styles/admin.css';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    order_id: '',
    amount: '',
    payment_method: 'Momo',
    transaction_id: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getPayments();
      setPayments(res.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        order_id: payment.order_id || '',
        amount: payment.amount || '',
        payment_method: payment.payment_method || 'Momo',
        transaction_id: payment.transaction_id || '',
        status: payment.status || 'pending',
      });
    } else {
      setEditingPayment(null);
      setFormData({
        order_id: '',
        amount: '',
        payment_method: 'Momo',
        transaction_id: '',
        status: 'pending',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPayment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        order_id: parseInt(formData.order_id),
        amount: parseFloat(formData.amount),
      };
      if (editingPayment) {
        await updatePayment(editingPayment.payment_id, submitData);
      } else {
        await createPayment(submitData);
      }
      handleCloseModal();
      fetchPayments();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDelete = async (payment) => {
    if (!window.confirm(`Bạn có chắc muốn xóa thanh toán #${payment.payment_id}?`)) {
      return;
    }
    try {
      await deletePayment(payment.payment_id);
      fetchPayments();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', color: '#f59e0b' },
      successful: { label: 'Thành công', color: '#10b981' },
      failed: { label: 'Thất bại', color: '#ef4444' },
      cancelled: { label: 'Đã hủy', color: '#6b7280' },
    };
    const statusInfo = statusMap[status] || { label: status, color: '#6b7280' };
    return (
      <span className="status-badge" style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}>
        {statusInfo.label}
      </span>
    );
  };

  const columns = [
    { header: 'ID', accessor: 'payment_id' },
    { header: 'Mã đơn hàng', accessor: 'order_id' },
    { 
      header: 'Số tiền', 
      accessor: 'amount',
      render: (val) => formatCurrency(val || 0)
    },
    { header: 'Phương thức', accessor: 'payment_method' },
    { header: 'Mã giao dịch', accessor: 'transaction_id' },
    { 
      header: 'Trạng thái', 
      accessor: 'status',
      render: (val) => getStatusBadge(val)
    },
    { 
      header: 'Ngày tạo', 
      accessor: 'created_at',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý thanh toán</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Thêm thanh toán
        </button>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="Chưa có thanh toán nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingPayment ? 'Chỉnh sửa thanh toán' : 'Thêm thanh toán mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Mã đơn hàng *</label>
              <input
                type="number"
                value={formData.order_id}
                onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Số tiền *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phương thức thanh toán *</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                required
              >
                <option value="Momo">Momo</option>
                <option value="ZaloPay">ZaloPay</option>
                <option value="Bank Transfer">Chuyển khoản</option>
                <option value="Cash">Tiền mặt</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="successful">Thành công</option>
                <option value="failed">Thất bại</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Mã giao dịch</label>
            <input
              type="text"
              value={formData.transaction_id}
              onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
              placeholder="VD: MOMO123456"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingPayment ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;

