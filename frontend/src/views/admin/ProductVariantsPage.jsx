import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Swal from 'sweetalert2';
import { 
  getProducts,
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant
} from '../../services/adminService';
import '../../styles/admin.css';

const ProductVariantsPage = () => {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    price: '',
    sale_price: '',
    stock_quantity: '',
    weight: '',
    unit: 'kg',
    status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [variantsRes, productsRes] = await Promise.all([
        getProductVariants(),
        getProducts(),
      ]);
      setVariants(variantsRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVariant(null);
    setFormData({
      product_id: selectedProduct || '',
      name: '',
      price: '',
      sale_price: '',
      stock_quantity: '',
      weight: '',
      unit: 'kg',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData({
      product_id: variant.product_id || '',
      name: variant.name || '',
      price: variant.price || '',
      sale_price: variant.sale_price || '',
      stock_quantity: variant.stock_quantity || '',
      weight: variant.weight || '',
      unit: variant.unit || 'kg',
      status: variant.status || 'active',
    });
    setModalOpen(true);
  };

  const handleDelete = async (variant) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      html: `Bạn có chắc muốn xóa biến thể<br><strong>"${variant.name}"</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await deleteProductVariant(variant.variant_id);
        Swal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: `Biến thể "${variant.name}" đã được xóa`,
          timer: 2000,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi khi xóa!',
          text: error.message,
          confirmButtonText: 'Đóng'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.product_id || !formData.name || !formData.price) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (Sản phẩm, Tên biến thể, Giá gốc)');
        return;
      }

      const variantData = {
        ...formData,
        product_id: String(formData.product_id), // Keep as String, not parseInt!
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      // Validate parsed values
      if (isNaN(variantData.price) || variantData.price <= 0) {
        alert('Giá gốc phải là số dương');
        return;
      }

      console.log('Submitting variant data:', variantData); // Debug

      if (editingVariant) {
        await updateProductVariant(editingVariant.variant_id, variantData);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: `Biến thể "${variantData.name}" đã được cập nhật`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createProductVariant(variantData);
        Swal.fire({
          icon: 'success',
          title: 'Thêm mới thành công!',
          text: `Biến thể "${variantData.name}" đã được thêm`,
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Submit error:', error); // Debug
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: error.message,
        confirmButtonText: 'Đóng'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.product_id === productId);
    return product ? product.name : 'N/A';
  };

  const filteredVariants = selectedProduct 
    ? variants.filter(v => v.product_id === parseInt(selectedProduct))
    : variants;

  const columns = [
    { 
      accessor: 'variant_id',
      header: 'ID',
      render: (value) => `#${value}`
    },
    { 
      accessor: 'product_id',
      header: 'Sản phẩm',
      render: (value) => getProductName(value)
    },
    { 
      accessor: 'name',
      header: 'Tên biến thể',
      render: (value) => <strong>{value}</strong>
    },
    { 
      accessor: 'price',
      header: 'Giá gốc',
      render: (value) => formatCurrency(value)
    },
    { 
      accessor: 'sale_price',
      header: 'Giá khuyến mãi',
      render: (value) => value ? (
        <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
          {formatCurrency(value)}
        </span>
      ) : '-'
    },
    { 
      accessor: 'stock_quantity',
      header: 'Tồn kho',
      render: (value) => (
        <span style={{ 
          color: value > 50 ? '#059669' : value > 10 ? '#d97706' : '#dc2626',
          fontWeight: 'bold'
        }}>
          {value}
        </span>
      )
    },
    { 
      accessor: 'weight',
      header: 'Khối lượng',
      render: (value, row) => {
        const weight = value || 1;
        const unit = row.unit || 'kg';
        return `${weight} ${unit}`;
      }
    },
    { 
      accessor: 'status',
      header: 'Trạng thái',
      render: (value) => (
        <span className={`status-badge ${value === 'active' ? 'active' : 'inactive'}`}>
          {value === 'active' ? 'Hoạt động' : 'Ngừng bán'}
        </span>
      )
    },
  ];

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý Biến thể Sản phẩm</h1>
          <p className="page-description">
            Quản lý các biến thể như trọng lượng, kích cỡ của sản phẩm
          </p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary">
          + Thêm biến thể
        </button>
      </div>

      {/* Filter by Product */}
      <div className="filter-section" style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: 600, minWidth: '100px' }}>
            Lọc theo sản phẩm:
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              minWidth: '300px'
            }}
          >
            <option value="">Tất cả sản phẩm ({variants.length} biến thể)</option>
            {products.map(product => {
              const count = variants.filter(v => v.product_id === product.product_id).length;
              return (
                <option key={product.product_id} value={product.product_id}>
                  {product.name} ({count} biến thể)
                </option>
              );
            })}
          </select>
          {selectedProduct && (
            <button
              onClick={() => setSelectedProduct('')}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVariants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVariant ? 'Sửa biến thể' : 'Thêm biến thể mới'}
      >
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Sản phẩm <span style={{ color: 'red' }}>*</span></label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleInputChange}
              required
              className="form-control"
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(product => (
                <option key={product.product_id} value={product.product_id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tên biến thể <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="VD: 500g, 1kg, Size L..."
              required
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giá gốc (VNĐ) <span style={{ color: 'red' }}>*</span></label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="150000"
                required
                min="0"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Giá khuyến mãi (VNĐ)</label>
              <input
                type="number"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleInputChange}
                placeholder="120000"
                min="0"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số lượng tồn kho <span style={{ color: 'red' }}>*</span></label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="100"
                required
                min="0"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Khối lượng <span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="0.5"
                  required
                  min="0"
                  step="0.01"
                  style={{ flex: 2 }}
                  className="form-control"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  style={{ flex: 1 }}
                  className="form-control"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lít">lít</option>
                  <option value="con">con</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingVariant ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductVariantsPage;
