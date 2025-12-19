import React, { useState } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../services/apiClient';
import '../styles/EditProfileModal.css';

const ChangePasswordModal = ({ isOpen, onClose, userId }) => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.old_password) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập mật khẩu hiện tại',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!formData.new_password) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập mật khẩu mới',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (formData.new_password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu không hợp lệ',
        text: 'Mật khẩu mới phải có ít nhất 6 ký tự',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu không khớp',
        text: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (formData.old_password === formData.new_password) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu trùng lặp',
        text: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.put(`/api/users/${userId}/change-password`, {
        old_password: formData.old_password,
        new_password: formData.new_password
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đổi mật khẩu thành công',
          timer: 1500,
          showConfirmButton: false
        });

        // Reset form
        setFormData({
          old_password: '',
          new_password: '',
          confirm_password: ''
        });

        onClose();
      } else {
        throw new Error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Change password error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || error.message || 'Không thể đổi mật khẩu',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      old_password: '',
      new_password: '',
      confirm_password: ''
    });
    setShowPasswords({
      old: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Đổi mật khẩu</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="old_password">Mật khẩu hiện tại</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.old ? 'text' : 'password'}
                id="old_password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('old')}
                disabled={isLoading}
              >
                {showPasswords.old ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new_password">Mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('new')}
                disabled={isLoading}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="form-hint">Mật khẩu phải có ít nhất 6 ký tự</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Xác nhận mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={isLoading}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
