import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  getCart, 
  updateCartItemByVariant, 
  removeCartItemByVariant, 
  clearCart 
} from '../services/cartService';
import { createOrder } from '../services/orderService';
import { enrichLocalCartItems } from '../utils/cartHelpers';
import CheckoutModal from '../components/checkout/CheckoutModal';
import '../styles/cart.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchCart();
  }, []);

  // Auto-open checkout modal if ?checkout=true
  useEffect(() => {
    const shouldCheckout = searchParams.get('checkout');
    if (shouldCheckout === 'true' && cart && cart.items && cart.items.length > 0) {
      console.log('[CART PAGE] Auto-opening checkout modal from Buy Now flow');
      setShowCheckout(true);
      // Remove checkout param from URL
      searchParams.delete('checkout');
      setSearchParams(searchParams);
    }
  }, [cart, searchParams, setSearchParams]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      let cartData = res.data;
      
      // If cart items don't have product details (localStorage cart), enrich them
      if (cartData.items && cartData.items.length > 0) {
        const needsEnrichment = cartData.items.some(item => !item.variant || !item.product);
        if (needsEnrichment) {
          const enrichedItems = await enrichLocalCartItems(cartData.items);
          cartData = { ...cartData, items: enrichedItems };
        }
      }
      
      setCart(cartData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemByVariant(item.variant_id, newQuantity);
      fetchCart();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleRemoveItem = async (item) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return;
    }
    try {
      await removeCartItemByVariant(item.variant_id);
      fetchCart();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      return;
    }
    try {
      await clearCart();
      fetchCart();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    const isLoggedIn = !!localStorage.getItem('seafresh_token');
    if (!isLoggedIn) {
      navigate('/auth?mode=login');
      return;
    }

    setShowCheckout(true);
  };

  const handleCheckoutComplete = async (checkoutData) => {
    setIsProcessing(true);
    try {
      const orderData = {
        shipping_address: checkoutData.shipping_address,
        shipping_fee: 30000,
        items: cart.items.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      };

      const result = await createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      alert(`Đặt hàng thành công! Mã đơn hàng: ${result.data.order_id}`);
      navigate('/customer/orders');
    } catch (err) {
      alert('Lỗi: ' + err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.variant?.sale_price || item.variant?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="cart-container">
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <p className="error-text">{error}</p>
        <Link to="/" className="btn-primary">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Giỏ hàng của bạn</h2>
        <div className="cart-empty">
          <p>Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="btn-primary">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Giỏ hàng của bạn</h2>
        <button onClick={handleClearCart} className="btn-link">
          Xóa tất cả
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => {
            const price = item.variant?.sale_price || item.variant?.price || 0;
            const total = price * item.quantity;
            const itemKey = item.cart_item_id || `local-${item.variant_id}`;
            
            return (
              <div key={itemKey} className="cart-item">
                {item.product?.image_url && (
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                )}
                
                <div className="cart-item-info">
                  <h3>
                    {item.product?.product_id ? (
                      <Link to={`/product/${item.product.product_id}`}>
                        {item.product.name || 'Sản phẩm'}
                      </Link>
                    ) : (
                      <span>{item.product?.name || 'Sản phẩm'}</span>
                    )}
                  </h3>
                  <p className="cart-item-variant">{item.variant?.name || 'Đang tải...'}</p>
                  <p className="cart-item-price">{formatCurrency(price)}</p>
                  {item.variant?.stock_quantity && item.variant.stock_quantity < item.quantity && (
                    <p className="stock-warning">
                      ⚠️ Chỉ còn {item.variant.stock_quantity} sản phẩm
                    </p>
                  )}
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      disabled={item.quantity >= (item.variant?.stock_quantity || 0)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="cart-item-total">{formatCurrency(total)}</p>
                  
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="btn-remove"
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Tổng kết đơn hàng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{formatCurrency(30000)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(calculateTotal() + 30000)}</span>
          </div>
          
          {!localStorage.getItem('seafresh_token') && (
            <div style={{ 
              padding: '12px', 
              background: '#fff3cd', 
              border: '1px solid #ffc107', 
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              💡 Bạn cần <Link to="/auth?mode=login" style={{ color: '#007bff', fontWeight: 'bold' }}>đăng nhập</Link> để thanh toán
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={isProcessing || !localStorage.getItem('seafresh_token')}
            className="btn-checkout"
          >
            {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
          </button>

          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            cartItems={cart?.items || []}
            onComplete={handleCheckoutComplete}
          />
          
          <Link to="/" className="btn-continue">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

