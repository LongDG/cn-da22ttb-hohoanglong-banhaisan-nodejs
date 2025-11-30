import { useState } from 'react';
import '../../styles/checkout.css';

const AddressForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    recipient_name: '',
    phone_number: '',
    full_address: '',
    is_default: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = 'Vui lòng nhập tên người nhận';
    }
    if (!formData.full_address.trim()) {
      newErrors.full_address = 'Vui lòng nhập địa chỉ';
    }
    if (formData.phone_number && !/^[0-9]{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await onSubmit(formData);
        // Form will be hidden by parent component after successful submit
      } catch (error) {
        // Error handling is done in parent
      }
    }
  };

  return (
    <div className="address-form-container">
      <div className="form-header">
        <h3>Thêm địa chỉ mới</h3>
        <p className="form-hint">💡 Nhập thông tin địa chỉ để nhận hàng</p>
      </div>

      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label>
            Tên người nhận <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.recipient_name}
            onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
            placeholder="Nhập tên người nhận"
            className={errors.recipient_name ? 'error' : ''}
          />
          {errors.recipient_name && (
            <span className="error-message">{errors.recipient_name}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Số điện thoại
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            placeholder="Nhập số điện thoại (10-11 số)"
            className={errors.phone_number ? 'error' : ''}
          />
          {errors.phone_number && (
            <span className="error-message">{errors.phone_number}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Địa chỉ đầy đủ <span className="required">*</span>
          </label>
          <textarea
            value={formData.full_address}
            onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            rows="4"
            className={errors.full_address ? 'error' : ''}
          />
          {errors.full_address && (
            <span className="error-message">{errors.full_address}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
            />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Lưu địa chỉ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;

