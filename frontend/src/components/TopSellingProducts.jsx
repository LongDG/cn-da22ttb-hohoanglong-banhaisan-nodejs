import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './TopSellingProducts.css';

// Hiển thị 5 sản phẩm bán chạy nhất, tránh kéo giãn ảnh gây mờ
const TopSellingProducts = ({ limit = 5, days = 30 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopSellingProducts();
  }, [limit, days]);

  const fetchTopSellingProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/products/top-selling?limit=${limit}&days=${days}`);

      // Cho phép cả hai trường hợp: interceptor đã unwrap hoặc chưa
      console.log('API Response (top-selling):', response);
      const resData = response?.success ? response : response?.data;

      if (resData && resData.success) {
        const productsList = Array.isArray(resData.data) ? resData.data : [];
        setProducts(productsList.slice(0, limit)); // sử dụng limit từ props
      } else {
        setError('Không thể tải sản phẩm bán chạy');
      }
    } catch (err) {
      console.error('Error fetching top selling products:', err);
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  const getDisplayPrice = (product) => {
    const displayVariant = product?.variants && product.variants.length > 0 
      ? product.variants[0] 
      : null;
    return displayVariant 
      ? (displayVariant.sale_price || displayVariant.price) 
      : 0;
  };

  if (loading) {
    return (
      <div className="top-selling-section">
        <h2 className="section-title">🔥 BÁN CHẠY NHẤT</h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-selling-section">
        <h2 className="section-title">🔥 BÁN CHẠY NHẤT</h2>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="top-selling-section">
        <h2 className="section-title">🔥 SẢN PHẨM NỔI BẬT</h2>
        <p className="empty-state">Chưa có dữ liệu bán hàng trong tháng</p>
      </div>
    );
  }

  // Bảo đảm đủ số lượng sản phẩm theo limit (thêm placeholder nếu thiếu)
  const displayProducts = [...products];
  while (displayProducts.length < limit) {
    displayProducts.push(null);
  }

  const ProductCard = ({ product, rank }) => {
    if (!product) {
      return (
        <div className="product-card placeholder-card">
          <div className="card-image-wrapper">
            <div className="placeholder-image">
              <span className="placeholder-icon">🦞</span>
            </div>
          </div>
          <div className="card-content">
            <h3 className="product-title">Sản phẩm đang cập nhật</h3>
            <p className="product-price">0₫</p>
          </div>
        </div>
      );
    }

    const displayPrice = getDisplayPrice(product);
    const displayVariant = product.variants && product.variants.length > 0 
      ? product.variants[0] 
      : null;
    const isTop1 = rank === 1;

    return (
      <Link 
        to={`/product/${product.product_id}`} 
        className={`product-card ${isTop1 ? 'top-1-card' : ''}`}
      >
        {isTop1 && (
          <div className="top-1-badge">
            <span className="top-1-icon">🥇</span>
            <span className="top-1-text">TOP 1</span>
          </div>
        )}
        
        {!isTop1 && <div className="rank-badge">#{rank}</div>}
        
        <div className="card-image-wrapper">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="placeholder-image" style={{ display: product.image_url ? 'none' : 'flex' }}>
            <span className="placeholder-icon">🦞</span>
          </div>
          
          {/* Ưu tiên sales_metric, fallback totalSold */}
          {(product.sales_metric > 0 || product.totalSold > 0) && (
            <div className="sales-badge">
              <span className="sales-icon">⚡</span>
              Đã bán {product.sales_metric || product.totalSold}
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="product-title">{product.name}</h3>
          
          {displayVariant && (
            <p className="product-variant">{displayVariant.name}</p>
          )}
          
          <div className="price-section">
            {displayVariant?.sale_price && displayVariant.sale_price < displayVariant.price ? (
              <>
                <span className="sale-price">{formatPrice(displayVariant.sale_price)}</span>
                <span className="original-price">{formatPrice(displayVariant.price)}</span>
                <span className="discount-badge">
                  -{Math.round((1 - displayVariant.sale_price / displayVariant.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="current-price">{formatPrice(displayPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="top-selling-section">
      <div className="section-header">
        <h2 className="section-title">🔥 BÁN CHẠY NHẤT THÁNG NÀY</h2>
        <p className="section-subtitle">Top {Math.min(products.length, limit)} sản phẩm được yêu thích nhất</p>
      </div>

      <div className="top-selling-grid">
        {displayProducts.map((product, index) => (
          <ProductCard 
            key={product?.product_id || `placeholder-${index}`} 
            product={product} 
            rank={index + 1} 
          />
        ))}
      </div>
    </section>
  );
};

export default TopSellingProducts;
