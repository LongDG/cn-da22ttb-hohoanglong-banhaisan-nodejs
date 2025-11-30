import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/adminService';
import '../../styles/admin.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    role: 'customer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
        phone_number: user.phone_number || '',
        role: user.role || 'customer',
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: '',
        email: '',
        password: '',
        phone_number: '',
        role: 'customer',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }
      if (editingUser) {
        await updateUser(editingUser.user_id, submitData);
      } else {
        if (!submitData.password) {
          alert('Vui lòng nhập mật khẩu');
          return;
        }
        await createUser(submitData);
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.full_name}"?`)) {
      return;
    }
    try {
      await deleteUser(user.user_id);
      fetchUsers();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const columns = [
    { header: 'ID', accessor: 'user_id' },
    { header: 'Họ tên', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Số điện thoại', accessor: 'phone_number' },
    { 
      header: 'Vai trò', 
      accessor: 'role',
      render: (val) => (
        <span className={`role-badge role-${val}`}>
          {val === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
        </span>
      )
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
        <h2>Quản lý người dùng</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Thêm người dùng
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="Chưa có người dùng nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Họ tên *</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu {editingUser ? '(để trống nếu không đổi)' : '*'}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Vai trò</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Khách hàng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingUser ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;

