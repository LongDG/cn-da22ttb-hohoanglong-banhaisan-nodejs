import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: 'Trà Vinh',
    estimatedDistance: '< 5km', // Default distance
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default COD
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Load cart items and user info on mount
  useEffect(() => {
    const loadData = async () => {
      // 1. ƯU TIÊN đọc từ localStorage trước (nhanh hơn API)
      const savedCart = localStorage.getItem('checkout_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart && Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCartItems(parsedCart);
            console.log('[CHECKOUT] Loaded cart from localStorage:', parsedCart.length, 'items');
          }
        } catch (e) {
          console.error('[CHECKOUT] Error parsing localStorage cart:', e);
        }
      }

      // 2. Sau đó sync với API (để cập nhật giá/tồn kho mới nhất)
      await loadCartItems();
      await loadUserInfo();
      await loadSavedAddresses();
      setLoading(false);
      setHasLoaded(true);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCartItems = async () => {
    try {
      const token = localStorage.getItem('seafresh_token');
      if (!token) {
        navigate('/auth?mode=login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/carts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('[CHECKOUT] API response:', result);
        
        // API trả về: { success: true, data: { items: [...] } }
        const items = result.data?.items || result.items || [];
        
        // Map lại structure để phù hợp với UI
        const mappedItems = items.map(item => ({
          cart_item_id: item.cart_item_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          variant: item.variant,
          product_name: item.product?.name || 'Sản phẩm',
          image_url: item.product?.image_url,
          price: item.variant?.price,
          sale_price: item.variant?.sale_price
        }));
        
        console.log('[CHECKOUT] Mapped items:', mappedItems);
        
        // Lưu vào localStorage để lần sau load nhanh hơn
        if (mappedItems.length > 0) {
          localStorage.setItem('checkout_cart', JSON.stringify(mappedItems));
          console.log('[CHECKOUT] Saved', mappedItems.length, 'items to localStorage');
        }
        
        setCartItems(mappedItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Nếu API lỗi, giữ nguyên data từ localStorage đã load trước đó
    }
  };

  const loadUserInfo = async () => {
    try {
      // Lấy user info từ localStorage (đã lưu khi login)
      const userStr = localStorage.getItem('seafresh_user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log('[CHECKOUT] Loaded user from localStorage:', userData.user_id);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('seafresh_token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const addresses = result.data || [];
        setSavedAddresses(addresses);
        console.log('[CHECKOUT] Loaded addresses:', addresses.length);
        
        // Tự động chọn địa chỉ mặc định
        const defaultAddress = addresses.find(addr => addr.is_default);
        const firstAddress = addresses[0];
        
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.address_id);
          fillAddressForm(defaultAddress);
        } else if (firstAddress) {
          setSelectedAddressId(firstAddress.address_id);
          fillAddressForm(firstAddress);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const fillAddressForm = (address) => {
    if (!address) return;
    
    // Parse full_address nếu có
    const fullAddr = address.full_address || '';
    const parts = fullAddr.split(',').map(p => p.trim());
    
    setShippingInfo(prev => ({
      ...prev,
      fullName: address.recipient_name || prev.fullName,
      phone: address.phone_number || prev.phone,
      address: parts[0] || '',
      ward: parts[1] || '',
      district: parts[2] || '',
      province: parts[3] || 'Trà Vinh'
    }));
  };

  const handleSelectAddress = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    
    if (addressId === 'new') {
      // Xóa form để nhập mới
      setShippingInfo(prev => ({
        ...prev,
        address: '',
        ward: '',
        district: ''
      }));
    } else {
      // Điền địa chỉ đã chọn
      const selected = savedAddresses.find(addr => addr.address_id === addressId);
      if (selected) {
        fillAddressForm(selected);
      }
    }
  };

  // Calculate shipping fee based on subtotal and distance
  const calculateShippingFee = (subtotal, distanceRange) => {
    // Freeship for orders >= 3,000,000đ
    if (subtotal >= 3000000) return 0;

    switch (distanceRange) {
      case '< 5km':
        return subtotal >= 500000 ? 0 : 20000;
      
      case '5-8km':
        return subtotal >= 1000000 ? 0 : 30000;
      
      case '> 8km':
        return subtotal >= 2000000 ? 0 : 40000;
      
      default:
        return 20000;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.sale_price || item.variant?.sale_price || item.variant?.price || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shippingFee = 0; // Miễn phí ship
  const discount = appliedVoucher?.discount_value || 0;
  const total = Math.max(0, subtotal + shippingFee - discount); // Không cho phép tổng âm

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nhập mã giảm giá',
        text: 'Vui lòng nhập mã giảm giá'
      });
      return;
    }

    try {
      const token = localStorage.getItem('seafresh_token');
      const response = await fetch(`http://localhost:3000/api/vouchers/validate/${voucherCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const voucher = await response.json();
        
        // Kiểm tra giá trị đơn hàng tối thiểu
        if (voucher.minimum_order_value && subtotal < voucher.minimum_order_value) {
          Swal.fire({
            icon: 'warning',
            title: 'Không đủ điều kiện',
            text: `Đơn hàng tối thiểu ${formatCurrency(voucher.minimum_order_value)} để sử dụng mã này`,
            confirmButtonColor: '#0284c7'
          });
          return;
        }
        
        setAppliedVoucher(voucher);
        Swal.fire({
          icon: 'success',
          title: 'Áp dụng thành công!',
          text: `Giảm ${formatCurrency(voucher.discount_value)}`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Mã giảm giá không hợp lệ'
      });
    }
  };

  // Validate form
  const validateForm = () => {
    if (!shippingInfo.fullName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập họ tên'
      });
      return false;
    }

    if (!shippingInfo.phone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập số điện thoại'
      });
      return false;
    }

    if (!shippingInfo.address.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập địa chỉ giao hàng'
      });
      return false;
    }

    if (!paymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn thanh toán',
        text: 'Vui lòng chọn phương thức thanh toán'
      });
      return false;
    }

    return true;
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Kiểm tra giỏ hàng có sản phẩm không
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Giỏ hàng trống',
        text: 'Không có sản phẩm để đặt hàng',
        confirmButtonColor: '#0284c7'
      });
      return;
    }
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('seafresh_token');
      
      // Chuẩn bị items từ cartItems
      const orderItems = cartItems.map(item => {
        const variantId = item.variant_id || item.variant?.variant_id;
        const price = item.sale_price || item.variant?.sale_price || item.variant?.price || item.price;
        
        if (!variantId) {
          console.error('[CHECKOUT] Missing variant_id for item:', item);
          throw new Error(`Sản phẩm thiếu thông tin variant_id`);
        }
        
        return {
          variant_id: variantId,
          quantity: parseInt(item.quantity),
          price: parseFloat(price)
        };
      });
      
      console.log('[CHECKOUT] Prepared order items:', orderItems);
      
      // Format shipping address thành string
      const shippingAddressString = `${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.province}`.trim();
      
      const orderData = {
        items: orderItems,
        shipping_address: shippingAddressString, // GỬI STRING thay vì object
        payment_method: paymentMethod,
        shipping_fee: shippingFee,
        voucher_code: appliedVoucher?.voucher_code || null,
        notes: shippingInfo.notes
      };

      console.log('[CHECKOUT] Order data:', orderData);

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Xóa localStorage cart sau khi đặt hàng thành công
        localStorage.removeItem('checkout_cart');
        
        await Swal.fire({
          icon: 'success',
          title: 'Đặt hàng thành công!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 1rem; margin: 1rem 0;">
                Mã đơn hàng: <strong style="color: #059669; font-size: 1.25rem;">${result?.data?.order_id || result?.order?.order_id}</strong>
              </p>
              <p style="font-size: 0.875rem; color: #6b7280;">
                Cảm ơn bạn đã đặt hàng tại Biển Tươi!
              </p>
            </div>
          `,
          confirmButtonText: 'Xem đơn hàng',
          confirmButtonColor: '#0284c7'
        });

        navigate('/customer/orders');
      } else {
        const errorData = await response.json();
        console.error('[CHECKOUT] Error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Không thể đặt hàng');
      }
    } catch (error) {
      console.error('[CHECKOUT] Order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Đặt hàng thất bại',
        text: error.message || 'Có lỗi xảy ra, vui lòng thử lại',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        {/* LEFT COLUMN - Main Content */}
        <div className="checkout-main">
          
          {/* Header */}
          <div className="checkout-header">
            <button className="btn-back" onClick={() => navigate('/cart')}>
              ← Quay lại giỏ hàng
            </button>
            <h1>Thanh toán</h1>
          </div>

          {/* Shipping Information Section */}
          <div className="checkout-section">
            <div className="section-header">
              <h2>Thông tin giao hàng</h2>
            </div>

            {/* Dropdown chọn địa chỉ đã lưu */}
            {savedAddresses.length > 0 && (
              <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
                <label htmlFor="selectAddress">
                  Chọn địa chỉ đã lưu
                </label>
                <select
                  id="selectAddress"
                  value={selectedAddressId}
                  onChange={handleSelectAddress}
                  className="form-select"
                  style={{ fontSize: '0.95rem', padding: '0.75rem' }}
                >
                  {savedAddresses.map(addr => (
                    <option key={addr.address_id} value={addr.address_id}>
                      {addr.recipient_name} - {addr.phone_number} - {addr.full_address}
                      {addr.is_default ? ' (Mặc định)' : ''}
                    </option>
                  ))}
                  <option value="new">+ Thêm địa chỉ mới</option>
                </select>
              </div>
            )}

            <div className="form-grid">
              {/* Hàng 1: Họ tên + Số điện thoại (2 cột) */}
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="form-input"
                />
              </div>

              {/* Hàng 2: Tỉnh + Quận + Phường (3 cột trên desktop) */}
              <div className="form-group form-province">
                <label htmlFor="province">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={shippingInfo.province}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>

              <div className="form-group form-district">
                <label htmlFor="district">Quận/Huyện</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={shippingInfo.district}
                  onChange={handleInputChange}
                  placeholder="Nhập quận/huyện"
                  className="form-input"
                />
              </div>

              <div className="form-group form-ward">
                <label htmlFor="ward">Phường/Xã</label>
                <input
                  type="text"
                  id="ward"
                  name="ward"
                  value={shippingInfo.ward}
                  onChange={handleInputChange}
                  placeholder="Nhập phường/xã"
                  className="form-input"
                />
              </div>

              {/* Hàng 3: Địa chỉ chi tiết (full width) */}
              <div className="form-group full-width">
                <label htmlFor="address">Địa chỉ chi tiết <span className="required">*</span></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Số nhà, tên đường"
                  className="form-input"
                />
              </div>

              {/* Đã bỏ phần khoảng cách - Miễn phí ship toàn bộ */}

              <div className="form-group full-width">
                <label htmlFor="notes">Ghi chú (tùy chọn)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={shippingInfo.notes}
                  onChange={handleInputChange}
                  placeholder="Thời gian giao hàng, yêu cầu đặc biệt..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-section">
            <div className="section-header">
              <h2>Phương thức thanh toán</h2>
            </div>

            <div className="payment-methods">
              
              {/* Banking Option */}
              <div
                className={`payment-option ${paymentMethod === 'banking' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('banking')}
              >
                <div className="payment-radio">
                  <input
                    type="radio"
                    name="payment"
                    value="banking"
                    checked={paymentMethod === 'banking'}
                    onChange={() => setPaymentMethod('banking')}
                  />
                </div>
                <div className="payment-info">
                  <h4>Chuyển khoản ngân hàng</h4>
                  <p>Thanh toán qua QR Code hoặc chuyển khoản</p>
                </div>
              </div>

              {/* COD Option */}
              <div
                className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="payment-radio">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                </div>
                <div className="payment-info">
                  <h4>Thanh toán khi nhận hàng (COD)</h4>
                  <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="sidebar-sticky">
            
            {/* Order Summary Header */}
            <div className="summary-header">
              <h3>Đơn hàng của bạn</h3>
              <span className="item-count">{cartItems.length} sản phẩm</span>
            </div>

            {/* Product List */}
            <div className="product-summary">
              {cartItems.map((item) => {
                const price = item.sale_price || item.variant?.sale_price || item.variant?.price || item.price || 0;
                const productName = item.product_name || item.product?.name || 'Sản phẩm';
                const variantName = item.variant?.name || item.variant?.variant_name || '';
                const imageUrl = item.image_url || item.product?.image_url || '/images/placeholder.png';
                
                return (
                  <div key={item.cart_item_id} className="summary-item">
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="item-image"
                      onError={(e) => e.target.src = '/images/placeholder.png'}
                    />
                    <div className="item-details">
                      <h4>{productName}</h4>
                      <p className="item-variant">{variantName}</p>
                      <p className="item-quantity">SL: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {formatCurrency(price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Voucher Input */}
            <div className="voucher-section">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="voucher-input"
                disabled={appliedVoucher}
              />
              <button
                onClick={handleApplyVoucher}
                className="btn-apply-voucher"
                disabled={appliedVoucher}
              >
                {appliedVoucher ? '✓' : 'Áp dụng'}
              </button>
            </div>

            {appliedVoucher && (
              <div className="voucher-applied">
                <span>✓ Mã giảm giá: {appliedVoucher.voucher_code}</span>
                <button
                  onClick={() => {
                    setAppliedVoucher(null);
                    setVoucherCode('');
                  }}
                  className="btn-remove-voucher"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="price-summary">
              <div className="price-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? 'text-success' : ''}>
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </span>
              </div>
              {appliedVoucher && (
                <div className="price-row discount">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Tổng cộng:</span>
                <span className="total-amount">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Miễn phí ship toàn bộ đơn hàng */}
            <div className="shipping-info-box">
              <p className="info-title">Chính sách vận chuyển</p>
              <ul className="info-list">
                <li><strong>Miễn phí ship</strong> cho tất cả đơn hàng</li>
                <li>Giao hàng trong vòng 24-48 giờ</li>
                <li>Đóng gói cẩn thận, đảm bảo chất lượng</li>
              </ul>
            </div>

            {/* Banking QR Code (Show when banking selected) */}
            {paymentMethod === 'banking' && (
              <div className="qr-payment-section">
                <div className="qr-header">
                  <h4>Thông tin chuyển khoản</h4>
                </div>

                <div className="qr-code-wrapper">
                  <img
                    src="/images/qr-banking.png"
                    alt="QR Code"
                    className="qr-code-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <p className="qr-hint">Quét mã QR để thanh toán</p>
                </div>

                <div className="bank-details">
                  <div className="bank-row">
                    <span className="label">Ngân hàng:</span>
                    <span className="value">Vietcombank</span>
                  </div>
                  <div className="bank-row">
                    <span className="label">Số tài khoản:</span>
                    <span className="value mono">1234567890</span>
                  </div>
                  <div className="bank-row">
                    <span className="label">Chủ tài khoản:</span>
                    <span className="value">BIEN TUOI</span>
                  </div>
                </div>

                <div className="transfer-note">
                  <p className="note-title">Nội dung chuyển khoản</p>
                  <div className="user-code-box">
                    {user?.user_id || 'USER123'}
                  </div>
                  <p className="note-hint">Vui lòng ghi chính xác mã này</p>
                </div>

                <div className="banking-notice" style={{marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem', fontSize: '0.875rem'}}>
                  <strong style={{color: '#92400e'}}>⏰ Lưu ý:</strong>
                  <p style={{margin: '0.25rem 0 0 0', color: '#78350f'}}>Sau khi chuyển khoản, đơn hàng sẽ được xác nhận trong vòng <strong>5-10 phút</strong>. Vui lòng giữ lại ảnh chụp giao dịch.</p>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !paymentMethod}
              className="btn-place-order"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Hoàn tất đơn hàng
                  <span className="arrow">→</span>
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
