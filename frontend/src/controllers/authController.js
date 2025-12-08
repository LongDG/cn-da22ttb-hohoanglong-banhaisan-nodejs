import { loginUser, registerUser } from '../services/authService';

const authController = {
  async login(payload) {
    const response = await loginUser(payload);
    // apiClient interceptor trả về response.data (đã unwrap)
    // Backend trả về: { success: true, data: { user: {...}, token: "..." } }
    // Sau interceptor: response = { success: true, data: { user: {...}, token: "..." } }
    console.log('[AUTH CONTROLLER] Login response (full):', JSON.stringify(response, null, 2));
    
    // Thử nhiều cách truy cập để đảm bảo lấy được đúng data
    const user = response?.data?.user || response?.user || (response?.success && response?.data?.user);
    const token = response?.data?.token || response?.token || (response?.success && response?.data?.token);
    
    console.log('[AUTH CONTROLLER] Extracted user:', user);
    console.log('[AUTH CONTROLLER] Extracted token:', token ? 'Token exists' : 'No token');
    console.log('[AUTH CONTROLLER] User role:', user?.role);
    console.log('[AUTH CONTROLLER] Response structure check:');
    console.log('  - response.data:', response?.data);
    console.log('  - response.data?.user:', response?.data?.user);
    console.log('  - response.data?.token:', response?.data?.token);
    console.log('  - response.user:', response?.user);
    console.log('  - response.token:', response?.token);
    
    if (!user || !token) {
      console.error('[AUTH CONTROLLER] Missing user or token in response:', response);
      throw new Error('Không nhận được thông tin người dùng từ server');
    }
    
    return {
      user,
      token,
      message: 'Đăng nhập thành công',
    };
  },
  async register(payload) {
    const response = await registerUser(payload);
    console.log('[AUTH CONTROLLER] Register response:', response);
    
    const user = response?.data?.user || response?.user;
    const token = response?.data?.token || response?.token;
    
    if (!user || !token) {
      console.error('[AUTH CONTROLLER] Missing user or token in response:', response);
      throw new Error('Không nhận được thông tin người dùng từ server');
    }
    
    return {
      user,
      token,
      message: 'Đăng ký thành công',
    };
  },
};

export default authController;

