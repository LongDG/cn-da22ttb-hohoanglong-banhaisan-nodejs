// User View - Presentation Component
import React from 'react';
import './UserView.css';

const UserView = ({ 
  users, 
  loading, 
  error, 
  formData, 
  editingUser,
  onInputChange, 
  onSubmit, 
  onEdit, 
  onDelete,
  onCancelEdit 
}) => {
  return (
    <section className="section">
      <h2>Quản lý Users</h2>
      
      <div className="form-container">
        <h3>{editingUser ? 'Chỉnh sửa User' : 'Thêm User mới'}</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={onInputChange}
            placeholder="Tên"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onInputChange}
            placeholder="Email"
            required
          />
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={onInputChange}
            placeholder="Tuổi"
          />
          <div className="form-actions">
            <button type="submit">
              {editingUser ? 'Cập nhật' : 'Thêm User'}
            </button>
            {editingUser && (
              <button type="button" onClick={onCancelEdit} className="btn-cancel">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="list-container">
        <h3>Danh sách Users</h3>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : users.length === 0 ? (
          <div className="empty">Chưa có user nào</div>
        ) : (
          <div className="items-list">
            {users.map(user => (
              <div key={user.id} className="item-card">
                <h4>{user.name}</h4>
                <p><strong>Email:</strong> {user.email}</p>
                {user.age && <p><strong>Tuổi:</strong> {user.age}</p>}
                <div className="actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => onEdit(user)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => onDelete(user.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserView;

