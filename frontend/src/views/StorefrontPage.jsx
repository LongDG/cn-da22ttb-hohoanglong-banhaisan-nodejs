import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/storefront.css';
import productController from '../controllers/productController';
import ProductCard from '../components/ProductCard';

const StorefrontPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const response = await productController.fetchLandingData();
        if (!mounted) return;
        setCatalog(response.products);
        setCategories(response.categories);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const byCategory = selectedCategory === 'all'
      ? catalog
      : catalog.filter((item) => item.category_id === Number(selectedCategory));
    if (!searchTerm) return byCategory;
    const keyword = searchTerm.toLowerCase();
    return byCategory.filter((item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }, [catalog, selectedCategory, searchTerm]);

  const heroProduct = filteredProducts[0];
  const spotlight = filteredProducts.slice(1, 4);

  return (
    <div className="storefront">
      <section className="hero">
        <div>
          <p className="eyebrow">Hải sản chuẩn xuất khẩu</p>
          <h1>Giao trong 3 giờ tại TP.HCM</h1>
          <p className="hero-copy">
            Các loại tôm hùm, cua hoàng đế, cá hồi Na Uy được bảo quản chuẩn lạnh sâu, đóng gói và giao tận nơi.
          </p>
          <div className="hero-actions">
            <a href="#catalog" className="primary-btn">Khám phá menu</a>
            <Link to="/auth" className="ghost-btn">Đặt lịch nhận hàng</Link>
          </div>
          <ul className="hero-highlights">
            <li>40+ mặt hàng tươi sống</li>
            <li>Hỗ trợ làm sạch, sơ chế</li>
            <li>Đối tác resort 5*</li>
          </ul>
        </div>

        <div className="hero-feature">
          {heroProduct ? (
            <>
              <p>Sản phẩm nổi bật</p>
              <h2>{heroProduct.name}</h2>
              <p className="price">{heroProduct.displayPrice}</p>
              <p className="description">{heroProduct.description}</p>
              <Link to={`/product/${heroProduct.id}`} className="ghost-btn">
                Xem chi tiết
              </Link>
            </>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}
        </div>
      </section>

      <section className="spotlight" aria-label="Sản phẩm nổi bật">
        {spotlight.map((item) => (
          <article key={item.id}>
            <p>{item.category_name}</p>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span>{item.displayPrice}</span>
          </article>
        ))}
      </section>

      <section id="catalog" className="catalog">
        <header>
          <div>
            <p className="eyebrow">Danh mục hôm nay</p>
            <h2>Chọn loại hải sản bạn yêu thích</h2>
          </div>
          <div className="filter-bar">
            <input
              type="search"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </header>

        <div className="category-tabs">
          <button
            type="button"
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={selectedCategory === String(category.id) ? 'active' : ''}
              onClick={() => setSelectedCategory(String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading && <p>Đang tải sản phẩm...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StorefrontPage;

