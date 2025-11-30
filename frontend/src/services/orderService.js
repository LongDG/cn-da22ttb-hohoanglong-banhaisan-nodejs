import apiClient from './apiClient';

export const getOrders = (params) => apiClient.get('/api/orders', { params });
export const getOrderById = (orderId) => apiClient.get(`/api/orders/${orderId}`);
export const createOrder = (payload) => apiClient.post('/api/orders', payload);
export const updateOrder = (orderId, payload) => apiClient.put(`/api/orders/${orderId}`, payload);
export const deleteOrder = (orderId) => apiClient.delete(`/api/orders/${orderId}`);

