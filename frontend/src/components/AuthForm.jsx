import { useState } from 'react';
import { AUTH_INITIAL_STATE, buildAuthPayload, validateAuthForm } from '../models/authModel';

const AuthForm = ({ mode, onSubmit, isSubmitting, status }) => {
  const [formState, setFormState] = useState(AUTH_INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateAuthForm(mode, formState);
    setErrors(validation.errors);
    if (!validation.isValid) return;

    const payload = buildAuthPayload(mode, formState);
    await onSubmit(payload);
  };

  const renderInput = (label, name, type = 'text', placeholder = '') => (
    <label className="form-field" key={name}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={formState[name]}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isSubmitting}
      />
      {errors[name] && <small className="error-text">{errors[name]}</small>}
    </label>
  );

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="eyebrow small">
        {mode === 'login' ? 'Truy cập tài khoản' : 'Thông tin đăng ký'}
      </p>
      <h3 className="form-title">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h3>

      {mode === 'register' && renderInput('Họ tên đầy đủ', 'full_name', 'text', 'Nguyễn Văn A')}
      {renderInput('Email', 'email', 'email', 'you@example.com')}
      {renderInput('Mật khẩu', 'password', 'password', 'Ít nhất 6 ký tự')}
      {mode === 'register' && renderInput('Xác nhận mật khẩu', 'confirmPassword', 'password')}
      {mode === 'register' && renderInput('Số điện thoại', 'phone_number', 'tel', '0901 234 567')}

      {status && (
        <div className={`status-banner ${status.type}`}>
          {status.message}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="primary-btn">
        {isSubmitting ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default AuthForm;

