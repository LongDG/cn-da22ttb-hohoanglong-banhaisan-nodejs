import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  const [sidebarProducts, setSidebarProducts] = useState([]);
  
  // Xác định xem có đang chọn danh mục cụ thể hay không
  const isCategorySelected = categoryParam !== 'all';
  
  // Lấy tên danh mục được chọn
  const selectedCategoryName = useMemo(() => {
    if (!isCategorySelected) return null;
    const category = categories.find(cat => String(cat.id) === categoryParam);
    return category ? category.name : null;
  }, [categories, categoryParam, isCategorySelected]);

  // Fetch categories on mount
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const response = await productController.fetchLandingData();
        if (!mounted) return;
        setCategories(response.categories);
        // Lấy một số sản phẩm ngẫu nhiên cho sidebar
        if (response.products && response.products.length > 0) {
          const shuffled = [...response.products].sort(() => 0.5 - Math.random());
          setSidebarProducts(shuffled.slice(0, 3));
        }
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
              <span>Tất cả</span>
            </button>
            {/* Map categories từ database */}
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${selectedCategory === String(category.id) ? 'active' : ''}`}
                onClick={() => handleCategoryChange(String(category.id))}
              >
                <span>{category.name}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Products */}
          {sidebarProducts.length > 0 && (
            <div className="sidebar-products">
              <div className="sidebar-products-header">
                <h3>✨ Sản phẩm nổi bật</h3>
              </div>
              <div className="sidebar-products-list">
                {sidebarProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="sidebar-product-item"
                  >
                    <div className="sidebar-product-image">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="sidebar-product-info">
                      <h4>{product.name}</h4>
                      <p className="sidebar-product-price">{product.displayPrice}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="storefront-main">
          {/* Top Selling Products - Chỉ hiển thị khi chọn "Tất cả" */}
          {!isCategorySelected && <TopSellingProducts limit={8} days={30} />}

          {/* Danh sách sản phẩm */}
          <section className="products-section">
            <div className="products-header">
              <h2>
                {isCategorySelected && selectedCategoryName 
                  ? selectedCategoryName 
                  : 'Sản phẩm nổi bật'}
              </h2>
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
