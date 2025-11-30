import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getVouchers, createVoucher, updateVoucher, deleteVoucher } from '../../services/adminService';
import '../../styles/admin.css';

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'fixed_amount',
    value: '',
    expiry_date: '',
    usage_limit: '',
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await getVouchers();
      setVouchers(res.data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code || '',
        discount_type: voucher.discount_type || 'fixed_amount',
        value: voucher.value || '',
        expiry_date: voucher.expiry_date ? new Date(voucher.expiry_date).toISOString().split('T')[0] : '',
        usage_limit: voucher.usage_limit || '',
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        code: '',
        discount_type: 'fixed_amount',
        value: '',
        expiry_date: '',
        usage_limit: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingVoucher(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        value: parseFloat(formData.value),
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      };
      if (editingVoucher) {
        await updateVoucher(editingVoucher.voucher_id, submitData);
      } else {
        await createVoucher(submitData);
      }
      handleCloseModal();
      fetchVouchers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDelete = async (voucher) => {
    if (!window.confirm(`Bạn có chắc muốn xóa voucher "${voucher.code}"?`)) {
      return;
    }
    try {
      await deleteVoucher(voucher.voucher_id);
      fetchVouchers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const isVoucherValid = (voucher) => {
    const now = new Date();
    if (voucher.expiry_date && new Date(voucher.expiry_date) < now) return false;
    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) return false;
    return true;
  };

  const columns = [
    { header: 'ID', accessor: 'voucher_id' },
    { header: 'Mã code', accessor: 'code' },
    { 
      header: 'Loại giảm giá', 
      accessor: 'discount_type',
      render: (val) => val === 'fixed_amount' ? 'Giảm số tiền' : 'Giảm phần trăm'
    },
    { 
      header: 'Giá trị', 
      accessor: 'value',
      render: (val, row) => {
        if (row.discount_type === 'percentage') {
          return `${val}%`;
        }
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(val);
      }
    },
    { 
      header: 'Hạn sử dụng', 
      accessor: 'expiry_date',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
    { 
      header: 'Giới hạn', 
      accessor: 'usage_limit',
      render: (val) => val || 'Không giới hạn'
    },
    { 
      header: 'Đã dùng', 
      accessor: 'used_count',
      render: (val) => val || 0
    },
    { 
      header: 'Trạng thái', 
      accessor: 'voucher_id',
      render: (val, row) => {
        const valid = isVoucherValid(row);
        return (
          <span className={`status-badge ${valid ? 'status-active' : 'status-inactive'}`}>
            {valid ? 'Còn hiệu lực' : 'Hết hạn'}
          </span>
        );
      }
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý voucher</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Thêm voucher
        </button>
      </div>

      <DataTable
        columns={columns}
        data={vouchers}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="Chưa có voucher nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingVoucher ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Mã code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              placeholder="VD: SALE20K"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Loại giảm giá *</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                required
              >
                <option value="fixed_amount">Giảm số tiền</option>
                <option value="percentage">Giảm phần trăm</option>
              </select>
            </div>

            <div className="form-group">
              <label>Giá trị *</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                min="0"
                step={formData.discount_type === 'percentage' ? '1' : '1000'}
                placeholder={formData.discount_type === 'percentage' ? 'VD: 10' : 'VD: 20000'}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày hết hạn *</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Giới hạn sử dụng</label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                min="1"
                placeholder="Để trống = không giới hạn"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingVoucher ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VouchersPage;

