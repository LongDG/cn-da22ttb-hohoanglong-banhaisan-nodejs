import '../../styles/checkout.css';

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      description: 'Chuyển khoản qua ngân hàng. Thông tin sẽ được gửi sau khi đặt hàng.',
      details: 'STK: 1234567890 - Ngân hàng: Vietcombank - Chủ TK: SeaFresh',
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

      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => onSelect(method.id)}
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
                {method.details && (
                  <p className="payment-details">{method.details}</p>
                )}
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
    </div>
  );
};

export default PaymentMethodSelector;

