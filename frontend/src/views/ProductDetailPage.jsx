import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/storefront.css';
import productController from '../controllers/productController';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {product.variants.map((variant) => (
            <div key={variant.variant_id} className="variant-row">
              <div>
                <strong>{variant.name}</strong>
                <p>Tồn kho: {variant.stock_quantity}</p>
              </div>
              <span>{variant.displayPrice}</span>
            </div>
          ))}
        </div>

        <div className="cta-row">
          <button type="button" className="primary-btn">Đặt hàng ngay</button>
          <button type="button" className="ghost-btn" onClick={() => navigate('/')}>
            Xem sản phẩm khác
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;

