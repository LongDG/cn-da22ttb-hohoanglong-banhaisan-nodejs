import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../services/adminService';
import '../../styles/admin.css';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name || '',
        contact_info: supplier.contact_info || '',
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contact_info: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplier_id, formData);
      } else {
        await createSupplier(formData);
      }
      handleCloseModal();
      fetchSuppliers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDelete = async (supplier) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplier.name}"?`)) {
      return;
    }
    try {
      await deleteSupplier(supplier.supplier_id);
      fetchSuppliers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const columns = [
    { header: 'ID', accessor: 'supplier_id' },
    { header: 'Tên nhà cung cấp', accessor: 'name' },
    { header: 'Thông tin liên hệ', accessor: 'contact_info' },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý nhà cung cấp</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Thêm nhà cung cấp
        </button>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="Chưa có nhà cung cấp nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên nhà cung cấp *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Thông tin liên hệ</label>
            <textarea
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              rows="4"
              placeholder="Email, số điện thoại, địa chỉ..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingSupplier ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SuppliersPage;

