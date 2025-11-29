import apiClient from './apiClient';

export const getProducts = (params) => apiClient.get('/api/products', { params });
export const getProductById = (productId) => apiClient.get(`/api/products/${productId}`);
export const getCategories = () => apiClient.get('/api/categories');
export const getVariants = (params) => apiClient.get('/api/product-variants', { params });

