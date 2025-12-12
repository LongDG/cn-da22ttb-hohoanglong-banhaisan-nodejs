import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/storefront.css';
import productController from '../controllers/productController';
import { addItemToCart } from '../services/cartService';
import AddToCartFeedback from '../components/AddToCartFeedback';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');
  const isLoggedIn = !!localStorage.getItem('seafresh_token') && user.user_id;

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      try {
        const response = await productController.fetchProductDetail(productId);
        if (!mounted) return;
        setProduct(response);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    // Auto-select first variant if available
    if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const handleAddToCart = async () => {
    console.log('[ADD TO CART] Button clicked!');
    console.log('[ADD TO CART] isLoggedIn:', isLoggedIn);
    console.log('[ADD TO CART] selectedVariant:', selectedVariant);
    console.log('[ADD TO CART] quantity:', quantity);
    
    if (!isLoggedIn) {
      console.log('[ADD TO CART] Redirecting to login...');
      navigate('/auth?mode=login');
      return;
    }

    if (!selectedVariant) {
      console.log('[ADD TO CART] No variant selected');
      setError('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    if (quantity < 1 || quantity > selectedVariant.stock_quantity) {
      console.log('[ADD TO CART] Invalid quantity');
      setError(`Số lượng không hợp lệ. Tồn kho: ${selectedVariant.stock_quantity}`);
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      console.log('[ADD TO CART] Calling API with:', { variant_id: selectedVariant.variant_id, quantity });
      await addItemToCart(selectedVariant.variant_id, quantity);
      console.log('[ADD TO CART] Success!');
      setShowFeedback(true);
    } catch (err) {
      console.error('[ADD TO CART] Error:', err);
      setError(err.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleOrder = async () => {
    console.log('[BUY NOW] Button clicked!');
    console.log('[BUY NOW] isLoggedIn:', isLoggedIn);
    console.log('[BUY NOW] selectedVariant:', selectedVariant);
    console.log('[BUY NOW] quantity:', quantity);
    
    if (!isLoggedIn) {
      console.log('[BUY NOW] Redirecting to login...');
      navigate('/auth?mode=login');
      return;
    }

    if (!selectedVariant) {
      console.log('[BUY NOW] No variant selected');
      setError('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    if (quantity < 1 || quantity > selectedVariant.stock_quantity) {
      console.log('[BUY NOW] Invalid quantity');
      setError(`Số lượng không hợp lệ. Tồn kho: ${selectedVariant.stock_quantity}`);
      return;
    }

    setIsOrdering(true);
    setError(null);

    try {
      // Step 1: Automatically add to cart
      console.log('[BUY NOW] Adding to cart first...');
      await addItemToCart(selectedVariant.variant_id, quantity);
      console.log('[BUY NOW] Added to cart successfully!');
      
      // Step 2: Redirect to cart page with checkout=true flag
      console.log('[BUY NOW] Redirecting to checkout...');
      navigate('/cart?checkout=true');
    } catch (err) {
      console.error('[BUY NOW] Error:', err);
      setError(err.message || 'Có lỗi xảy ra khi xử lý đơn hàng');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return <p className="detail-container">Đang tải thông tin sản phẩm...</p>;
  }

  if (error || !product) {
    return (
      <div className="detail-container">
        <p className="error-text">{error || 'Không tìm thấy sản phẩm'}</p>
        <button type="button" className="ghost-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <section className="detail-container">
      <div className="detail-media">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
          alt={product.name}
        />
      </div>

      <div className="detail-info">
        <p className="eyebrow">{product.category_name}</p>
        <h1>{product.name}</h1>
        <p className="price big">{product.displayPrice}</p>
        <p>{product.description}</p>

        <div className="variant-list">
          <h4>Tuỳ chọn</h4>
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((variant) => (
              <div 
                key={variant.variant_id} 
                className={`variant-row ${selectedVariant?.variant_id === variant.variant_id ? 'selected' : ''}`}
                onClick={() => setSelectedVariant(variant)}
                style={{ cursor: 'pointer', padding: '10px', border: selectedVariant?.variant_id === variant.variant_id ? '2px solid #007bff' : '1px solid #ddd' }}
              >
                <div>
                  <strong>{variant.name}</strong>
                  <p>Tồn kho: {variant.stock_quantity || 0}</p>
                </div>
                <span>{variant.displayPrice}</span>
              </div>
            ))
          ) : (
            <p>Hiện chưa có biến thể sản phẩm</p>
          )}
        </div>

        {selectedVariant && (
          <div style={{ margin: '20px 0' }}>
            <label>
              Số lượng:
              <input
                type="number"
                min="1"
                max={selectedVariant.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
              />
            </label>
            <p>Tổng: {(selectedVariant.sale_price || selectedVariant.price) * quantity}₫</p>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        {!isLoggedIn && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffc107', 
            borderRadius: '5px', 
            margin: '20px 0' 
          }}>
            <p style={{ margin: 0 }}>
              💡 Bạn cần <strong>đăng nhập</strong> để đặt hàng. 
              <Link to="/auth?mode=login" style={{ marginLeft: '10px', color: '#007bff' }}>
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        )}

        <div className="cta-row">
          {isLoggedIn && (
            <button 
              type="button" 
              className="primary-btn" 
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant || (selectedVariant && selectedVariant.stock_quantity === 0)}
              style={{ marginRight: '10px' }}
            >
              {isAddingToCart ? 'Đang thêm...' : '🛒 Thêm vào giỏ hàng'}
            </button>
          )}
          <button 
            type="button" 
            className="primary-btn" 
            onClick={handleOrder}
            disabled={isOrdering || !selectedVariant || (selectedVariant && selectedVariant.stock_quantity === 0)}
          >
            {isOrdering ? 'Đang xử lý...' : isLoggedIn ? 'Đặt hàng ngay' : 'Đăng nhập để đặt hàng'}
          </button>
          <button type="button" className="ghost-btn" onClick={() => navigate('/')}>
            Xem sản phẩm khác
          </button>
        </div>

        <AddToCartFeedback
          show={showFeedback}
          onClose={() => setShowFeedback(false)}
          onGoToCart={() => { setShowFeedback(false); navigate('/cart'); }}
        />
      </div>
    </section>
  );
};

export default ProductDetailPage;

