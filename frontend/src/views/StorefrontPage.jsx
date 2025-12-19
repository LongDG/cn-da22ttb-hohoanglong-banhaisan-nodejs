import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/storefront.css';
import productController from '../controllers/productController';
import ProductCard from '../components/ProductCard';
import TrustAssuranceBar from '../components/TrustAssuranceBar';
import TopSellingProducts from '../components/TopSellingProducts';
import PartnerSlider from '../components/PartnerSlider';
import Footer from '../components/Footer';

const StorefrontPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const response = await productController.fetchLandingData();
        if (!mounted) return;
        setCategories(response.categories);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    let mounted = true;
    setSelectedCategory(categoryParam);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productController.fetchProductsByCategory(categoryParam);
        if (!mounted) return;
        setCatalog(response.products);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return catalog;
    const keyword = searchTerm.toLowerCase();
    return catalog.filter((item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }, [catalog, searchTerm]);

  // Handle category change - update URL
  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      navigate('/');
    } else {
      navigate(`/?category=${categoryId}`);
    }
  };

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
              onClick={() => handleCategoryChange('all')}
            >
              <span className="category-icon">📦</span>
              <span>Tất cả</span>
            </button>
            {/* Map categories từ database */}
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${selectedCategory === String(category.id) ? 'active' : ''}`}
                onClick={() => handleCategoryChange(String(category.id))}
              >
                <span className="category-icon">🔖</span>
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

      {/* Partner Slider - Phía trên Footer */}
      <PartnerSlider />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StorefrontPage;
