import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/storefront.css';
import productController from '../controllers/productController';
import ProductCard from '../components/ProductCard';
import TrustAssuranceBar from '../components/TrustAssuranceBar';
import TopSellingProducts from '../components/TopSellingProducts';

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
          {/* Top Selling Products - Asymmetric Grid */}
          <TopSellingProducts limit={6} days={30} />

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
