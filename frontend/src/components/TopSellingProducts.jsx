import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './TopSellingProducts.css';

const TopSellingProducts = ({ limit = 6, days = 30 }) => {
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
      
      if (response.data.success) {
        setProducts(response.data.data.slice(0, 6)); // Ensure max 6 products
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
    }).format(price);
  };

  const getDisplayPrice = (product) => {
    const displayVariant = product.variants && product.variants.length > 0 
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

  // Ensure we have at least placeholder products for the grid
  const displayProducts = [...products];
  while (displayProducts.length < 6) {
    displayProducts.push(null);
  }

  const ProductCard = ({ product, rank, isHero = false }) => {
    if (!product) {
      return (
        <div className={`product-card ${isHero ? 'hero-card' : ''} placeholder-card`}>
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

    return (
      <Link 
        to={`/product/${product.product_id}`} 
        className={`product-card ${isHero ? 'hero-card' : ''}`}
      >
        <div className="rank-badge">#{rank}</div>
        
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
          
          {product.sales_metric > 0 && (
            <div className="sales-badge">
              <span className="sales-icon">⚡</span>
              Đã bán {product.sales_metric}
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="product-title">{product.name}</h3>
          
          {displayVariant && !isHero && (
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

          {isHero && (
            <>
              {displayVariant && (
                <p className="hero-variant">{displayVariant.name}</p>
              )}
              <button className="hero-cta-btn">
                <span className="btn-icon">🛒</span>
                Mua Ngay
              </button>
            </>
          )}
        </div>
      </Link>
    );
  };

  return (
    <section className="top-selling-section">
      <div className="section-header">
        <h2 className="section-title">🔥 BÁN CHẠY NHẤT THÁNG NÀY</h2>
        <p className="section-subtitle">Top {products.length} sản phẩm được yêu thích nhất</p>
      </div>

      <div className="asymmetric-grid">
        {/* Top 1 - Hero Product */}
        <div className="grid-item hero-item">
          <ProductCard product={displayProducts[0]} rank={1} isHero={true} />
        </div>

        {/* Top 2 - Below Hero Left */}
        <div className="grid-item secondary-left">
          <ProductCard product={displayProducts[1]} rank={2} />
        </div>

        {/* Top 3 - Below Hero Right */}
        <div className="grid-item secondary-right">
          <ProductCard product={displayProducts[2]} rank={3} />
        </div>

        {/* Top 4, 5, 6 - Right Column Stack */}
        <div className="grid-item tertiary-top">
          <ProductCard product={displayProducts[3]} rank={4} />
        </div>

        <div className="grid-item tertiary-middle">
          <ProductCard product={displayProducts[4]} rank={5} />
        </div>

        <div className="grid-item tertiary-bottom">
          <ProductCard product={displayProducts[5]} rank={6} />
        </div>
      </div>
    </section>
  );
};

export default TopSellingProducts;
