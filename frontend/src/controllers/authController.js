import { loginUser, registerUser } from '../services/authService';

const authController = {
  async login(payload) {
    const response = await loginUser(payload);
    return {
      user: response?.data?.user,
      token: response?.data?.token,
      message: 'Đăng nhập thành công',
    };
  },
  async register(payload) {
    const response = await registerUser(payload);
    return {
      user: response?.data?.user,
      token: response?.data?.token,
      message: 'Đăng ký thành công',
    };
  },
};

export default authController;

