import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../services/apiClient';
import AddressCard from '../components/AddressCard';
import AddressModal from '../components/AddressModal';
import '../styles/AddressManagement.css';

const AddressManagementPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  useEffect(() => {
    if (!user.user_id) {
      navigate('/auth?mode=login');
      return;
    }
    fetchAddresses();
  }, [user.user_id, navigate]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/api/addresses?userId=${user.user_id}`);
      if (response.data.success) {
        setAddresses(response.data.data || []);
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách địa chỉ',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId) => {
    // Check if address is default
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
        const response = await apiClient.delete(`/api/addresses/${addressId}`);
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Đã xóa',
            text: 'Xóa địa chỉ thành công',
            timer: 1500,
            showConfirmButton: false
          });
          fetchAddresses(); // Reload list
        }
      } catch (error) {
        console.error('Delete address error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.response?.data?.message || 'Không thể xóa địa chỉ',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await apiClient.put(`/api/addresses/${addressId}`, {
        is_default: true
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã đặt làm địa chỉ mặc định',
          timer: 1500,
          showConfirmButton: false
        });
        fetchAddresses(); // Reload list
      }
    } catch (error) {
      console.error('Set default error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Không thể đặt làm mặc định',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    fetchAddresses(); // Reload list
  };

  if (isLoading) {
    return (
      <div className="address-page">
        <div className="address-container">
          <div className="address-header">
            <h1>Quản lý địa chỉ</h1>
          </div>
          <p className="loading-text">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="address-page">
      <div className="address-container">
        <div className="address-header">
          <h1>Quản lý địa chỉ</h1>
          <button className="btn-add-address" onClick={handleAddNew}>
            + Thêm địa chỉ mới
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có địa chỉ nào</p>
            <p className="empty-hint">Thêm địa chỉ để dễ dàng đặt hàng</p>
          </div>
        ) : (
          <div className="address-grid">
            {addresses.map(address => (
              <AddressCard
                key={address.address_id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        address={editingAddress}
        userId={user.user_id}
      />
    </div>
  );
};

export default AddressManagementPage;
