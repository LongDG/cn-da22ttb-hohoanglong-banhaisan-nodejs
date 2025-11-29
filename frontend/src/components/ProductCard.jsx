import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
          alt={product.name}
          loading="lazy"
        />
        <span className={`badge ${product.status === 'active' ? 'success' : 'warning'}`}>
          {product.status === 'active' ? 'Còn hàng' : 'Tạm hết'}
        </span>
      </div>

      <div className="product-card__body">
        <p className="category">{product.category_name}</p>
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="card-footer">
          <div>
            <p className="price">{product.displayPrice}</p>
            {product.variantSummary && <small>{product.variantSummary}</small>}
          </div>
          <Link to={`/product/${product.id}`} className="ghost-btn">
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

