import apiClient from './apiClient';

export const loginUser = (payload) => apiClient.post('/api/auth/login', payload);
export const registerUser = (payload) => apiClient.post('/api/auth/register', payload);

