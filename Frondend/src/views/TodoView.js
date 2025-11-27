// Todo View - Presentation Component
import React from 'react';
import './TodoView.css';

const TodoView = ({ 
  todos, 
  users,
  loading, 
  error, 
  formData, 
  editingTodo,
  onInputChange, 
  onSubmit, 
  onEdit, 
  onDelete,
  onToggleComplete,
  onCancelEdit 
}) => {
  return (
    <section className="section">
      <h2>Quản lý Todos</h2>
      
      <div className="form-container">
        <h3>{editingTodo ? 'Chỉnh sửa Todo' : 'Thêm Todo mới'}</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={onInputChange}
            placeholder="Tiêu đề"
            required
          />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={onInputChange}
            placeholder="Mô tả"
          />
          <select
            name="userId"
            value={formData.userId || ''}
            onChange={onInputChange}
            required
          >
            <option value="">Chọn User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed || false}
              onChange={onInputChange}
            />
            Đã hoàn thành
          </label>
          <div className="form-actions">
            <button type="submit">
              {editingTodo ? 'Cập nhật' : 'Thêm Todo'}
            </button>
            {editingTodo && (
              <button type="button" onClick={onCancelEdit} className="btn-cancel">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="list-container">
        <h3>Danh sách Todos</h3>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : todos.length === 0 ? (
          <div className="empty">Chưa có todo nào</div>
        ) : (
          <div className="items-list">
            {todos.map(todo => (
              <div 
                key={todo.id} 
                className={`item-card ${todo.completed ? 'todo-completed' : ''}`}
              >
                <h4>{todo.title}</h4>
                {todo.description && <p>{todo.description}</p>}
                <p><strong>User ID:</strong> {todo.userId}</p>
                <p><strong>Trạng thái:</strong> {todo.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</p>
                <div className="actions">
                  <button 
                    className="btn-complete" 
                    onClick={() => onToggleComplete(todo)}
                  >
                    {todo.completed ? 'Chưa hoàn thành' : 'Hoàn thành'}
                  </button>
                  <button 
                    className="btn-edit" 
                    onClick={() => onEdit(todo)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => onDelete(todo.id)}
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

export default TodoView;

