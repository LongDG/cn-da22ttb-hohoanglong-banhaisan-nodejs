import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/storefront.css';
import productController from '../controllers/productController';
import ProductCard from '../components/ProductCard';
import TrustAssuranceBar from '../components/TrustAssuranceBar';

// Danh sách danh mục với icon
const CATEGORY_LIST = [
  { id: 'bestseller', name: 'Bán Chạy Nhất', icon: '🔥' },
  { id: 'imported', name: 'Sản Phẩm Nhập Khẩu / Nội Địa', icon: '🌍' },
  { id: 'shrimp', name: 'Tôm', icon: '🦐' },
  { id: 'crab', name: 'Cua – Ghẹ', icon: '🦀' },
  { id: 'fish', name: 'Cá', icon: '🐟' },
  { id: 'shellfish', name: 'Nghêu – Sò – Ốc', icon: '🐚' },
  { id: 'abalone', name: 'Bào Ngư – Hàu', icon: '🦪' },
  { id: 'mussel', name: 'Vẹm – Bạch Tuộc', icon: '🐙' },
  { id: 'frozen', name: 'Hải Sản Đông Lạnh', icon: '❄️' },
  { id: 'sashimi', name: 'Sashimi', icon: '🍣' },
  { id: 'processed', name: 'Menu Chế Biến', icon: '🍽️' },
];

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

  const heroProduct = filteredProducts.length > 0 ? filteredProducts[0] : null;
  const spotlight = filteredProducts.length > 1 ? filteredProducts.slice(1, 4) : [];

  return (
    <div className="storefront-new">
      {/* Thanh cam kết dịch vụ */}
      <TrustAssuranceBar />

      {/* Layout 2 cột: Sidebar + Main Content */}
      <div className="storefront-layout">
        {/* Sidebar Danh mục */}
        <aside className="category-sidebar">
          <div className="sidebar-header">
            <h2>DANH MỤC</h2>
          </div>
          <nav className="category-nav">
            <button
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span className="category-icon">⭐</span>
              <span>Tất cả</span>
            </button>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat.id}
                className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
            {/* Map categories từ API */}
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${selectedCategory === String(category.id) ? 'active' : ''}`}
                onClick={() => setSelectedCategory(String(category.id))}
              >
                <span className="category-icon">🦞</span>
                <span>{category.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="storefront-main">
          {/* Banner Hero Section */}
          <section className="hero-banner-section">
            <div className="hero-main-banner">
              <div className="hero-image-placeholder">
                <div className="hero-text-overlay">
                  <h1>SLAY Vị ngon!</h1>
                  <p>Cua hấp tươi ngon</p>
                </div>
              </div>
            </div>
            <div className="hero-side-banners">
              <div className="side-banner king-crab">
                <h3>King Crab</h3>
                <p className="hotline">Hotline: 1900 6868</p>
              </div>
              <div className="side-banner abalone-kr">
                <h3>Bào Ngư Hàn Quốc</h3>
                <p className="price">2.500.000đ</p>
                <Link to="/product/1" className="buy-btn">MUA NGAY</Link>
              </div>
              <div className="side-banner lobster">
                <h3>Tôm Hùm Bông</h3>
                <p className="price">1.800.000đ</p>
                <Link to="/product/2" className="buy-btn">MUA NGAY</Link>
              </div>
            </div>
          </section>

          {/* Banner phụ */}
          <section className="secondary-banners">
            <div className="secondary-banner">
              <div className="banner-content">
                <h2>Cá Mú Trân Châu</h2>
                <p>Thượng hạng</p>
              </div>
            </div>
            <div className="secondary-banner">
              <div className="banner-content">
                <h2>Bào Ngư Úc</h2>
                <p>Tinh túy Australia</p>
              </div>
            </div>
          </section>

          {/* Danh sách sản phẩm */}
          <section className="products-section">
            <div className="products-header">
              <h2>Sản phẩm nổi bật</h2>
              <div className="search-bar">
                <input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            {loading && <p className="loading-text">Đang tải sản phẩm...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {!loading && !error && filteredProducts.length === 0 && (
              <p className="empty-text">Không tìm thấy sản phẩm nào.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default StorefrontPage;
