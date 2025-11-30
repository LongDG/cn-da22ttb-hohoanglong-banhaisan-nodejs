import { useState, useEffect } from 'react';
import { getAddresses, createAddress } from '../../services/addressService';
import AddressSelector from './AddressSelector';
import AddressForm from './AddressForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import '../../styles/checkout.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, onComplete }) => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');
  const userId = user.user_id;

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
      alert('Lỗi: ' + (error.message || 'Không thể tạo địa chỉ'));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // If showing form, don't allow next (user must submit form first)
      if (showAddressForm) {
        alert('Vui lòng hoàn thành và lưu địa chỉ trước khi tiếp tục');
        return;
      }
      // If no address selected and no addresses available, show form
      if (!selectedAddress && addresses.length === 0) {
        setShowAddressForm(true);
        return;
      }
      // If addresses exist but none selected, select first one
      if (!selectedAddress && addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
      // Proceed to next step
      if (selectedAddress) {
        setStep(2);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleComplete = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = `${selectedAddress.recipient_name} - ${selectedAddress.phone_number} - ${selectedAddress.full_address}`;
      
      await onComplete({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        address_id: selectedAddress.address_id,
      });
      
      onClose();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Không thể hoàn tất đơn hàng'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>Thanh toán</h2>
          <button className="checkout-close" onClick={onClose}>×</button>
        </div>

        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Địa chỉ giao hàng</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Phương thức thanh toán</div>
          </div>
        </div>

        <div className="checkout-content">
          {step === 1 && (
            <div className="checkout-step fade-in">
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
          )}

          {step === 2 && (
            <div className="checkout-step fade-in slide-up">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </div>
          )}
        </div>

        <div className="checkout-footer">
          {step === 1 && showAddressForm ? null : (
            step === 1 ? (
              <>
                <button className="btn-secondary" onClick={onClose}>
                  Hủy
                </button>
                <button className="btn-primary" onClick={handleNext}>
                  Tiếp tục →
                </button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button
                  className="btn-primary btn-complete"
                  onClick={handleComplete}
                  disabled={loading || !paymentMethod}
                >
                  {loading ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

