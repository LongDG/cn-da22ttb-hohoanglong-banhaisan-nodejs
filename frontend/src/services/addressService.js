import apiClient from './apiClient';

// Backend automatically uses authenticated user's ID
export const getAddresses = () => 
  apiClient.get('/api/addresses');
export const getAddressById = (id) => 
  apiClient.get(`/api/addresses/${id}`);
export const createAddress = (data) => 
  apiClient.post('/api/addresses', data);
export const updateAddress = (id, data) => 
  apiClient.put(`/api/addresses/${id}`, data);
export const deleteAddress = (id) => 
  apiClient.delete(`/api/addresses/${id}`);

