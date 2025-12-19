import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../services/apiClient';
import AddressModal from './AddressModal';
import '../styles/EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.full_name || '',
        phone_number: userData.phone_number || ''
      });
      
      // Fetch addresses when modal opens
      if (isOpen && userData.user_id) {
        fetchAddresses();
      }
    }
  }, [userData, isOpen]);

  const fetchAddresses = async () => {
    if (!userData?.user_id) return;
    
    setIsLoadingAddresses(true);
    try {
      const response = await apiClient.get(`/api/addresses?userId=${userData.user_id}`);
      
      // apiClient đã unwrap response, response.data là array hoặc object với success
      if (Array.isArray(response.data)) {
        setAddresses(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
      setAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.full_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập họ tên',
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

    // Phone number validation (10-11 digits)
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

    setIsLoading(true);

    try {
      const response = await apiClient.put(`/api/users/${userData.user_id}`, formData);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật thông tin thành công',
          timer: 1500,
          showConfirmButton: false
        });

        // Call onUpdate callback to refresh data
        if (onUpdate) {
          onUpdate(response.data.data);
        }

        onClose();
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || error.message || 'Không thể cập nhật thông tin',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    const address = addresses.find(a => a.address_id === addressId);
    if (address && address.is_default) {
      Swal.fire({
        icon: 'warning',
        title: 'Không thể xóa',
        text: 'Không thể xóa địa chỉ mặc định. Vui lòng đặt địa chỉ khác làm mặc định trước.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/addresses/${addressId}`);
        Swal.fire({
          icon: 'success',
          title: 'Đã xóa',
          text: 'Xóa địa chỉ thành công',
          timer: 1500,
          showConfirmButton: false
        });
        fetchAddresses();
      } catch (error) {
        console.error('Delete address error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.message || 'Không thể xóa địa chỉ',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await apiClient.put(`/api/addresses/${addressId}`, {
        is_default: true
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã đặt làm địa chỉ mặc định',
        timer: 1500,
        showConfirmButton: false
      });
      fetchAddresses();
    } catch (error) {
      console.error('Set default error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể đặt làm mặc định',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const handleAddressModalSuccess = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa thông tin cá nhân</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="full_name">Họ và tên</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Số điện thoại</label>
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

          <div className="form-group">
            <div className="address-section-header">
              <label>Địa chỉ</label>
              <button 
                type="button" 
                className="btn-add-address-small"
                onClick={handleAddAddress}
                disabled={isLoading}
              >
                + Thêm địa chỉ
              </button>
            </div>

            {isLoadingAddresses ? (
              <p className="loading-addresses">Đang tải địa chỉ...</p>
            ) : addresses.length === 0 ? (
              <p className="no-addresses">Chưa có địa chỉ nào</p>
            ) : (
              <div className="address-list">
                {addresses.map(address => (
                  <div key={address.address_id} className={`address-item ${address.is_default ? 'default' : ''}`}>
                    <div className="address-item-content">
                      {address.is_default && (
                        <span className="badge-default-small">Mặc định</span>
                      )}
                      <p className="address-name">{address.recipient_name}</p>
                      <p className="address-phone">{address.phone_number}</p>
                      <p className="address-text">{address.full_address}</p>
                    </div>
                    <div className="address-item-actions">
                      <button
                        type="button"
                        className="btn-address-action"
                        onClick={() => handleEditAddress(address)}
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="btn-address-action"
                        onClick={() => handleDeleteAddress(address.address_id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                      {!address.is_default && (
                        <button
                          type="button"
                          className="btn-set-default-small"
                          onClick={() => handleSetDefault(address.address_id)}
                        >
                          Đặt mặc định
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        onSuccess={handleAddressModalSuccess}
        address={editingAddress}
        userId={userData?.user_id}
      />
    </div>
  );
};

export default EditProfileModal;
