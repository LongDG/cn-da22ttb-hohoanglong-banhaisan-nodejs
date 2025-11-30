import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token vào headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('seafresh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
    // Chỉ redirect khi đang ở protected routes (admin hoặc customer)
    if (error?.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isProtectedRoute = currentPath.startsWith('/admin') || currentPath.startsWith('/customer');
      
      if (isProtectedRoute) {
        localStorage.removeItem('seafresh_token');
        localStorage.removeItem('seafresh_user');
        // Chỉ redirect khi đang ở protected route
        if (currentPath !== '/auth') {
          window.location.href = '/auth';
        }
      } else {
        // Ở public routes, chỉ xóa token không hợp lệ nhưng không redirect
        // Điều này cho phép user tiếp tục xem sản phẩm mà không cần đăng nhập
        const token = localStorage.getItem('seafresh_token');
        if (token) {
          // Token không hợp lệ nhưng đang ở public route, chỉ xóa token
          localStorage.removeItem('seafresh_token');
          localStorage.removeItem('seafresh_user');
        }
      }
    }
    
    const message = error?.response?.data?.error || error.message || 'Đã xảy ra lỗi';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

