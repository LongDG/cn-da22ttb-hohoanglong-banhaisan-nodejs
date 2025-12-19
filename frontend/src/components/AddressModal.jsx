import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../services/apiClient';

const AddressModal = ({ isOpen, onClose, onSuccess, address, userId }) => {
  const [formData, setFormData] = useState({
    recipient_name: '',
    phone_number: '',
    full_address: '',
    is_default: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      // Edit mode - populate form
      setFormData({
        recipient_name: address.recipient_name || '',
        phone_number: address.phone_number || '',
        full_address: address.full_address || '',
        is_default: address.is_default || false
      });
    } else {
      // Add mode - reset form
      setFormData({
        recipient_name: '',
        phone_number: '',
        full_address: '',
        is_default: false
      });
    }
  }, [address, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.recipient_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập tên người nhận',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!formData.phone_number.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập số điện thoại',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      Swal.fire({
        icon: 'warning',
        title: 'Số điện thoại không hợp lệ',
        text: 'Số điện thoại phải có 10-11 chữ số',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!formData.full_address.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập địa chỉ đầy đủ',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        user_id: userId
      };

      if (address) {
        // Edit mode
        await apiClient.put(`/api/addresses/${address.address_id}`, dataToSend);
      } else {
        // Add mode
        await apiClient.post('/api/addresses', dataToSend);
      }

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: address ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công',
        timer: 1500,
        showConfirmButton: false
      });

      onSuccess();
    } catch (error) {
      console.error('Address operation error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể thực hiện thao tác',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recipient_name">Tên người nhận <span className="required">*</span></label>
              <input
                type="text"
                id="recipient_name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                placeholder="Nhập tên người nhận"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Số điện thoại <span className="required">*</span></label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="full_address">Địa chỉ đầy đủ <span className="required">*</span></label>
            <textarea
              id="full_address"
              name="full_address"
              value={formData.full_address}
              onChange={handleChange}
              placeholder="Ví dụ: Số 284, Đường Đồng Khởi, Phường 6, Vĩnh Long"
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : (address ? 'Cập nhật' : 'Thêm địa chỉ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
