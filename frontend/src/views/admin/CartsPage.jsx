import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { getAllCarts, getCartByUserId } from '../../services/adminService';
import { getUsers } from '../../services/adminService';
import '../../styles/admin.css';

const CartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [cartDetails, setCartDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartsRes, usersRes] = await Promise.all([
        getAllCarts(),
        getUsers(),
      ]);
      setCarts(cartsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (cart) => {
    try {
      const res = await getCartByUserId(cart.user_id);
      setCartDetails(res.data);
      setSelectedCart(cart);
      setModalOpen(true);
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCart(null);
    setCartDetails(null);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.full_name || user.email : userId;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const columns = [
    { header: 'ID', accessor: 'cart_id' },
    { 
      header: 'Người dùng', 
      accessor: 'user_id',
      render: (val) => getUserName(val)
    },
    { 
      header: 'Số sản phẩm', 
      accessor: 'item_count',
      render: (val) => val || 0
    },
    { 
      header: 'Ngày tạo', 
      accessor: 'created_at',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
    { 
      header: 'Cập nhật lần cuối', 
      accessor: 'updated_at',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý giỏ hàng</h2>
      </div>

      <DataTable
        columns={columns}
        data={carts}
        loading={loading}
        onEdit={handleViewDetails}
        emptyMessage="Chưa có giỏ hàng nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`Chi tiết giỏ hàng #${selectedCart?.cart_id} - ${getUserName(selectedCart?.user_id)}`}
        size="large"
      >
        {cartDetails && (
          <div className="cart-details">
            <div className="order-info-section">
              <h4>Thông tin giỏ hàng</h4>
              <div className="info-grid">
                <div>
                  <label>Mã giỏ hàng:</label>
                  <span>{cartDetails.cart_id}</span>
                </div>
                <div>
                  <label>Người dùng:</label>
                  <span>{getUserName(cartDetails.user_id)}</span>
                </div>
                <div>
                  <label>Số sản phẩm:</label>
                  <span>{cartDetails.items?.length || 0}</span>
                </div>
                <div>
                  <label>Ngày tạo:</label>
                  <span>{new Date(cartDetails.created_at).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>

            {cartDetails.items && cartDetails.items.length > 0 ? (
              <div className="order-items-section">
                <h4>Sản phẩm trong giỏ hàng</h4>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Biến thể</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartDetails.items.map((item, index) => {
                      const price = item.variant.sale_price || item.variant.price;
                      const total = price * item.quantity;
                      return (
                        <tr key={index}>
                          <td>
                            {item.product?.name || 'N/A'}
                            {item.product?.image_url && (
                              <img 
                                src={item.product.image_url} 
                                alt={item.product.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', marginLeft: '8px', borderRadius: '4px' }}
                              />
                            )}
                          </td>
                          <td>{item.variant.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(price)}</td>
                          <td>{formatCurrency(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                      <td style={{ fontWeight: 'bold' }}>
                        {formatCurrency(
                          cartDetails.items.reduce((sum, item) => {
                            const price = item.variant.sale_price || item.variant.price;
                            return sum + (price * item.quantity);
                          }, 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="order-items-section">
                <p>Giỏ hàng trống</p>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CartsPage;

