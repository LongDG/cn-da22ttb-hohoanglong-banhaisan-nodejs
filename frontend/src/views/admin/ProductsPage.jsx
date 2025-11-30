import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { 
  getProducts, 
  getCategories, 
  getSuppliers,
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/adminService';
import '../../styles/admin.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    category_id: '',
    supplier_id: '',
    status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getSuppliers(),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setSuppliers(suppliersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        image_url: product.image_url || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        status: product.status || 'active',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        image_url: '',
        category_id: '',
        supplier_id: '',
        status: 'active',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.product_id, formData);
      } else {
        await createProduct(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }
    try {
      await deleteProduct(product.product_id);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const columns = [
    { header: 'ID', accessor: 'product_id' },
    { header: 'Tên sản phẩm', accessor: 'name' },
    { header: 'Mô tả', accessor: 'description', render: (val) => val?.substring(0, 50) + '...' || '' },
    { 
      header: 'Danh mục', 
      accessor: 'category_id',
      render: (val) => {
        const category = categories.find(c => c.category_id === val);
        return category?.name || val;
      }
    },
    { 
      header: 'Trạng thái', 
      accessor: 'status',
      render: (val) => (
        <span className={`status-badge status-${val}`}>
          {val === 'active' ? 'Hoạt động' : 'Ngừng bán'}
        </span>
      )
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý sản phẩm</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Thêm sản phẩm
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="Chưa có sản phẩm nào"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên sản phẩm *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>URL hình ảnh</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Danh mục *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Nhà cung cấp *</label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                required
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map(sup => (
                  <option key={sup.supplier_id} value={sup.supplier_id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;

