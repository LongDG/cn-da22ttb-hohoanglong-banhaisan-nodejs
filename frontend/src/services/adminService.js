import apiClient from './apiClient';

// Users
export const getUsers = () => apiClient.get('/api/users');
export const getUserById = (id) => apiClient.get(`/api/users/${id}`);
export const createUser = (data) => apiClient.post('/api/users', data);
export const updateUser = (id, data) => apiClient.put(`/api/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/api/users/${id}`);

// Products
export const getProducts = (params) => apiClient.get('/api/products', { params });
export const getProductById = (id) => apiClient.get(`/api/products/${id}`);
export const createProduct = (data) => apiClient.post('/api/products', data);
export const updateProduct = (id, data) => apiClient.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`/api/products/${id}`);

// Product Variants
export const getProductVariants = (params) => apiClient.get('/api/product-variants', { params });
export const getProductVariantById = (id) => apiClient.get(`/api/product-variants/${id}`);
export const createProductVariant = (data) => apiClient.post('/api/product-variants', data);
export const updateProductVariant = (id, data) => apiClient.put(`/api/product-variants/${id}`, data);
export const deleteProductVariant = (id) => apiClient.delete(`/api/product-variants/${id}`);

// Orders
export const getOrders = (params) => apiClient.get('/api/orders', { params });
export const getOrderById = (id) => apiClient.get(`/api/orders/${id}`);
export const updateOrder = (id, data) => apiClient.put(`/api/orders/${id}`, data);
export const deleteOrder = (id) => apiClient.delete(`/api/orders/${id}`);

// Categories
export const getCategories = (params) => apiClient.get('/api/categories', { params });
export const getCategoryById = (id) => apiClient.get(`/api/categories/${id}`);
export const createCategory = (data) => apiClient.post('/api/categories', data);
export const updateCategory = (id, data) => apiClient.put(`/api/categories/${id}`, data);
export const deleteCategory = (id) => apiClient.delete(`/api/categories/${id}`);

// Vouchers
export const getVouchers = () => apiClient.get('/api/vouchers');
export const getVoucherById = (id) => apiClient.get(`/api/vouchers/${id}`);
export const createVoucher = (data) => apiClient.post('/api/vouchers', data);
export const updateVoucher = (id, data) => apiClient.put(`/api/vouchers/${id}`, data);
export const deleteVoucher = (id) => apiClient.delete(`/api/vouchers/${id}`);

// Suppliers
export const getSuppliers = () => apiClient.get('/api/suppliers');
export const getSupplierById = (id) => apiClient.get(`/api/suppliers/${id}`);
export const createSupplier = (data) => apiClient.post('/api/suppliers', data);
export const updateSupplier = (id, data) => apiClient.put(`/api/suppliers/${id}`, data);
export const deleteSupplier = (id) => apiClient.delete(`/api/suppliers/${id}`);

// Payments
export const getPayments = (params) => apiClient.get('/api/payments', { params });
export const getPaymentById = (id) => apiClient.get(`/api/payments/${id}`);
export const createPayment = (data) => apiClient.post('/api/payments', data);
export const updatePayment = (id, data) => apiClient.put(`/api/payments/${id}`, data);
export const deletePayment = (id) => apiClient.delete(`/api/payments/${id}`);

// Carts (Admin)
export const getAllCarts = () => apiClient.get('/api/carts/admin/all');
export const getCartByUserId = (userId) => apiClient.get(`/api/carts/admin/user/${userId}`);

