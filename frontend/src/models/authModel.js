export const AUTH_INITIAL_STATE = {
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone_number: '',
};

export const buildAuthPayload = (mode, state) => {
  const payload = {
    email: state.email.trim(),
    password: state.password,
  };

  if (mode === 'register') {
    payload.full_name = state.full_name.trim();
    payload.phone_number = state.phone_number.trim();
  }

  return payload;
};

export const validateAuthForm = (mode, state) => {
  const errors = {};

  if (!state.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!state.password || state.password.length < 6) {
    errors.password = 'Mật khẩu tối thiểu 6 ký tự';
  }

  if (mode === 'register') {
    if (!state.full_name || state.full_name.length < 3) {
      errors.full_name = 'Họ tên tối thiểu 3 ký tự';
    }

    if (state.password !== state.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

