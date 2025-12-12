import '../../styles/checkout.css';

const PaymentMethodSelector = ({ selectedMethod, onSelect, totalAmount, user }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const paymentMethods = [
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      description: 'Chuyển khoản qua ngân hàng. Quét mã QR để thanh toán nhanh.',
    },
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: '💵',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng.',
      details: 'Phí thu hộ: 0đ',
    },
  ];

  return (
    <div className="payment-selector">
      <div className="section-header">
        <h3>Chọn phương thức thanh toán</h3>
      </div>

      {/* Split Layout: 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '40% 60%'
        }
      }} className="payment-split-layout">
        
        {/* LEFT COLUMN: Payment Method List */}
        <div className="payment-methods-list">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => onSelect(method.id)}
              style={{ marginBottom: '1rem', cursor: 'pointer' }}
            >
              <div className="payment-card-header">
                <div className="payment-radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === method.id}
                    onChange={() => onSelect(method.id)}
                  />
                  <span className="radio-custom"></span>
                </div>
                <div className="payment-icon">{method.icon}</div>
                <div className="payment-info">
                  <h4>{method.name}</h4>
                  <p className="payment-description">{method.description}</p>
                </div>
              </div>
              {selectedMethod === method.id && (
                <div className="selected-indicator payment-selected">
                  <span>✓ Đã chọn</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Preview Panel (Details) */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '2px solid #e5e7eb',
          minHeight: '500px',
          maxHeight: '600px',
          overflowY: 'auto',
          position: 'sticky',
          top: '1rem'
        }}>
          {!selectedMethod && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9ca3af'
            }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</span>
              <p style={{ fontSize: '1rem', textAlign: 'center' }}>
                Chọn phương thức thanh toán để xem chi tiết
              </p>
            </div>
          )}

          {/* COD Details */}
          {selectedMethod === 'cod' && (
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>💵</span>
                Thanh toán khi nhận hàng
              </h3>

              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                border: '2px solid #d1fae5',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>✅</div>
                
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#059669',
                  marginBottom: '1rem'
                }}>
                  Thanh toán khi nhận hàng
                </p>

                <div style={{
                  background: '#ecfdf5',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#065f46',
                    marginBottom: '0.5rem'
                  }}>
                    Tổng tiền thanh toán:
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#059669',
                    margin: 0
                  }}>
                    {formatCurrency(totalAmount || 0)}
                  </p>
                </div>

                <div style={{
                  background: '#fef3c7',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#92400e',
                    margin: 0
                  }}>
                    💡 <strong>Phí thu hộ:</strong> 0đ
                  </p>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#92400e',
                    marginTop: '0.5rem',
                    marginBottom: 0
                  }}>
                    Vui lòng chuẩn bị tiền mặt khi shipper giao hàng
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Banking Details */}
          {selectedMethod === 'banking' && (
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📱</span>
                Thông tin chuyển khoản
              </h3>

              {/* QR Code - Centered */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <img
                    src="/images/qr-banking.png"
                    alt="QR Code"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  marginTop: '0.75rem',
                  textAlign: 'center'
                }}>
                  Quét mã QR bằng ứng dụng ngân hàng
                </p>
              </div>

              {/* Total Amount */}
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid #93c5fd',
                marginBottom: '1rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  textAlign: 'center',
                  marginBottom: '0.25rem'
                }}>
                  Tổng tiền:
                </p>
                <p style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  textAlign: 'center',
                  margin: 0
                }}>
                  {formatCurrency(totalAmount || 0)}
                </p>
              </div>

              {/* User ID */}
              <div style={{
                background: '#fef3c7',
                border: '2px solid #fbbf24',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#92400e',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>⚠️</span>
                  Nội dung chuyển khoản
                </p>
                <div style={{
                  background: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    textAlign: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    Mã người dùng
                  </p>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    letterSpacing: '0.05em',
                    margin: 0
                  }}>
                    {user?.user_id || user?._id || user?.id || 'USER123'}
                  </p>
                </div>
                <p style={{
                  fontSize: '0.7rem',
                  color: '#92400e',
                  textAlign: 'center',
                  fontWeight: '500',
                  margin: 0
                }}>
                  ⭐ Vui lòng ghi chính xác mã này
                </p>
              </div>

              {/* Banking Details - Compact */}
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    🏦 Ngân hàng
                  </p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Vietcombank
                  </p>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    💳 Số tài khoản
                  </p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', fontFamily: 'monospace', margin: 0 }}>
                    1234567890
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    👤 Chủ tài khoản
                  </p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    BIEN TUOI
                  </p>
                </div>
              </div>

              {/* Note */}
              <div style={{
                padding: '0.75rem',
                background: '#dbeafe',
                borderRadius: '0.5rem',
                border: '1px solid #93c5fd'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#1e40af',
                  textAlign: 'center',
                  margin: 0
                }}>
                  <span style={{ fontWeight: '600' }}>📌 Lưu ý:</span> Sau khi chuyển khoản, chụp màn hình. 
                  Đơn hàng được xác nhận trong 5-10 phút.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;

