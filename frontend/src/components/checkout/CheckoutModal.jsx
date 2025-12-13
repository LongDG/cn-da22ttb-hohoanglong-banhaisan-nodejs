import { useState, useEffect } from 'react';
import { getAddresses, createAddress } from '../../services/addressService';
import AddressSelector from './AddressSelector';
import AddressForm from './AddressForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import Swal from 'sweetalert2';
import '../../styles/checkout.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, onComplete }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');
  const userId = user.user_id;

  // Calculate total amount from cart items
  const totalAmount = cartItems?.reduce((sum, item) => {
    const price = item.variant?.sale_price || item.variant?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0) || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      const userAddresses = res.data || [];
      setAddresses(userAddresses);
      
      // Auto-select default address if exists
      const defaultAddress = userAddresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0]);
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // If no addresses, show form
      if (addresses.length === 0) {
        setShowAddressForm(true);
      }
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const handleAddressCreated = async (addressData) => {
    try {
      const newAddress = {
        ...addressData,
        is_default: addresses.length === 0, // First address is default
      };
      const res = await createAddress(newAddress);
      const createdAddress = res.data;
      
      setAddresses([...addresses, createdAddress]);
      setSelectedAddress(createdAddress);
      setShowAddressForm(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể tạo địa chỉ',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleComplete = async () => {
    if (!paymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn phương thức thanh toán',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!selectedAddress) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn địa chỉ giao hàng',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = `${selectedAddress.recipient_name} - ${selectedAddress.phone_number} - ${selectedAddress.full_address}`;
      
      const result = await onComplete({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        address_id: selectedAddress.address_id,
      });
      
      // Show success message with order ID
      await Swal.fire({
        icon: 'success',
        title: 'Đặt hàng thành công!',
        html: `<p>Mã đơn hàng của bạn là:</p><p style="font-size: 1.5rem; font-weight: bold; color: #059669; font-family: monospace;">${result?.order?.order_id || 'Đang xử lý'}</p>`,
        confirmButtonText: 'Tiếp tục mua sắm',
        confirmButtonColor: '#10b981'
      });
      
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Đặt hàng thất bại',
        text: error.message || 'Không thể hoàn tất đơn hàng',
        confirmButtonText: 'Thử lại',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Payment method options for simple radio buttons
  const paymentMethods = [
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      description: 'Quét mã QR để thanh toán'
    },
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: '💵',
      description: 'Thanh toán bằng tiền mặt'
    }
  ];

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal checkout-modal-wide" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="checkout-header">
          <h2>Thanh toán</h2>
          <button className="checkout-close" onClick={onClose}>×</button>
        </div>

        {/* 2 COLUMN LAYOUT */}
        <div className="checkout-two-column">
          
          {/* LEFT COLUMN: Form Inputs (60-65%) */}
          <div className="checkout-left-column">
            
            {/* Section 1: Shipping Address */}
            <div className="checkout-section">
              <h3 className="section-title">
                <span className="section-icon">📍</span>
                Thông tin giao hàng
              </h3>
              {showAddressForm ? (
                <AddressForm
                  onSubmit={handleAddressCreated}
                  onCancel={() => {
                    setShowAddressForm(false);
                    if (addresses.length > 0) {
                      setSelectedAddress(addresses[0]);
                    }
                  }}
                />
              ) : (
                <AddressSelector
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onSelect={handleAddressSelect}
                  onAddNew={() => setShowAddressForm(true)}
                />
              )}
            </div>

            {/* Section 2: Payment Method (Simple Radio) */}
            <div className="checkout-section">
              <h3 className="section-title">
                <span className="section-icon">💳</span>
                Phương thức thanh toán
              </h3>
              <div className="payment-methods-simple">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="payment-radio">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                      <span className="radio-custom"></span>
                    </div>
                    <div className="payment-icon-simple">{method.icon}</div>
                    <div className="payment-info-simple">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="check-mark">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Payment Details (35-40%) */}
          <div className="checkout-right-column">
            <div className="order-summary-sidebar">
              
              {/* Order Summary Header */}
              <div className="summary-header">
                <h3>Đơn hàng của bạn</h3>
                <span className="item-count">({cartItems?.length || 0} sản phẩm)</span>
              </div>

              {/* Product List */}
              <div className="product-list-compact">
                {cartItems?.map((item, index) => {
                  const price = item.variant?.sale_price || item.variant?.price || item.price || 0;
                  return (
                    <div key={index} className="product-item-compact">
                      <img 
                        src={item.image_url || '/images/placeholder.png'} 
                        alt={item.product_name}
                        className="product-thumb"
                      />
                      <div className="product-info-compact">
                        <p className="product-name-compact">{item.product_name}</p>
                        <p className="product-variant">
                          {item.variant?.variant_name || ''} × {item.quantity}
                        </p>
                      </div>
                      <div className="product-price-compact">
                        {formatCurrency(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="price-row">
                  <span>Phí vận chuyển:</span>
                  <span className="text-success">Miễn phí</span>
                </div>
                <div className="price-row total-row">
                  <span>Tổng cộng:</span>
                  <span className="total-price">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Dynamic Payment Details Section */}
              {paymentMethod === 'banking' && (
                <div className="payment-qr-section">
                  <div className="qr-header">
                    <span className="qr-icon">🏦</span>
                    <h4>Thông tin chuyển khoản</h4>
                  </div>
                  
                  {/* QR Code */}
                  <div className="qr-container-sidebar">
                    <img
                      src="/images/qr-banking.png"
                      alt="QR Code"
                      className="qr-image-sidebar"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <p className="qr-hint-sidebar">Quét mã QR để thanh toán</p>
                  </div>

                  {/* Transfer Info */}
                  <div className="transfer-info-compact">
                    <div className="transfer-row">
                      <span className="label">🏦 Ngân hàng:</span>
                      <span className="value">Vietcombank</span>
                    </div>
                    <div className="transfer-row">
                      <span className="label">💳 Số TK:</span>
                      <span className="value mono">1234567890</span>
                    </div>
                    <div className="transfer-row">
                      <span className="label">👤 Chủ TK:</span>
                      <span className="value">BIEN TUOI</span>
                    </div>
                  </div>

                  {/* Transfer Content */}
                  <div className="transfer-content-highlight">
                    <p className="transfer-label">⚠️ Nội dung chuyển khoản:</p>
                    <p className="transfer-code">{user?.user_id || 'USER123'}</p>
                    <p className="transfer-note">Ghi chính xác mã này</p>
                  </div>
                </div>
              )}

              {/* Complete Button */}
              <button
                className="btn-complete-sidebar"
                onClick={handleComplete}
                disabled={loading || !paymentMethod || !selectedAddress}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Đang xử lý...
                  </>
                ) : (
                  'Hoàn tất đơn hàng'
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

