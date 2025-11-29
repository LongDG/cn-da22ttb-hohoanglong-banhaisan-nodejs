import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/auth.css';
import AuthForm from '../components/AuthForm';
import authController from '../controllers/authController';

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const navigate = useNavigate();
  const [mode, setModeState] = useState(queryMode);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setModeState(queryMode);
  }, [queryMode]);

  const updateMode = (nextMode) => {
    setModeState(nextMode);
    if (nextMode === 'login') {
      setSearchParams({});
    } else {
      setSearchParams({ mode: nextMode });
    }
  };

  const heroCopy = useMemo(
    () => (mode === 'login'
      ? 'Đăng nhập để tiếp tục khám phá thế giới hải sản tươi ngon.'
      : 'Đăng ký ngay để nhận ưu đãi độc quyền và đặt hàng nhanh chóng.'),
    [mode]
  );

  const heroTitle = mode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới';
  const heroBullets = mode === 'login'
    ? ['Giao nhanh 3h nội thành', '100% hải sản tươi sống', 'Ưu đãi riêng cho thành viên']
    : ['Ưu đãi 15% cho đơn đầu tiên', 'Theo dõi đơn hàng realtime', 'Nhận thông báo Flash sale'];

  const handleSubmit = async (formData) => {
    setStatus(null);
    setIsSubmitting(true);
    try {
      const controllerAction = mode === 'login' ? authController.login : authController.register;
      const result = await controllerAction(formData);
      setStatus({ type: 'success', message: result.message });

      if (mode === 'login' && result?.token) {
        localStorage.setItem('seafresh_token', result.token);
        localStorage.setItem('seafresh_user', JSON.stringify(result.user || {}));

        const role = result.user?.role === 'admin' ? 'admin' : 'customer';
        navigate(role === 'admin' ? '/admin' : '/customer', { replace: true });
        return;
      }

      if (mode === 'register') {
        updateMode('login');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Đã xảy ra lỗi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchModeCopy = mode === 'login'
    ? { text: 'Chưa có tài khoản?', action: 'Đăng ký ngay', next: 'register' }
    : { text: 'Đã có tài khoản?', action: 'Đăng nhập ngay', next: 'login' };

  return (
    <main className="auth-page minimal">
      <section className="auth-grid">
        <div className="auth-visual">
          <div className="auth-visual__overlay">
            <p className="eyebrow">xSeaFresh</p>
            <h1>{heroTitle}</h1>
            <p>{heroCopy}</p>
            <ul className="hero-list">
              {heroBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel__card">
            <div className="auth-panel__head">
              <div className="logo-mark large" aria-label="SeaFresh logo">
                <span role="img" aria-hidden="true">🌊</span>
              </div>
              <h2>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h2>
              <p>{mode === 'login' ? 'Nhập thông tin của bạn để truy cập tài khoản.' : heroCopy}</p>
            </div>

            <AuthForm
              key={mode}
              mode={mode}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              status={status}
            />

            <div className="auth-panel__footer">
              <p>{switchModeCopy.text}</p>
              <button type="button" onClick={() => updateMode(switchModeCopy.next)}>
                {switchModeCopy.action}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;


