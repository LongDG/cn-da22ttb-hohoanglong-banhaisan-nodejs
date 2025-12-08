import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import '../styles/auth.css';
import AuthForm from '../components/AuthForm';
import authController from '../controllers/authController';
import { syncLocalCartToDatabase } from '../services/cartService';

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

  // Kiểm tra nếu đã đăng nhập thì redirect
  useEffect(() => {
    const token = localStorage.getItem('seafresh_token');
    const userStr = localStorage.getItem('seafresh_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const isAdmin = user?.role === 'admin';
        
        if (isAdmin) {
          // Admin đã đăng nhập, redirect đến Admin Dashboard
          navigate('/admin', { replace: true });
        } else {
          // Customer đã đăng nhập, redirect đến Customer Portal
          navigate('/customer', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Nếu lỗi parse, xóa token và user để đăng nhập lại
        localStorage.removeItem('seafresh_token');
        localStorage.removeItem('seafresh_user');
      }
    }
  }, [navigate]);

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
        console.log('[AUTH PAGE] ============ LOGIN FLOW START ============');
        console.log('[AUTH PAGE] Result object:', JSON.stringify(result, null, 2));
        console.log('[AUTH PAGE] Result.token type:', typeof result.token);
        console.log('[AUTH PAGE] Result.token value:', result.token ? result.token.substring(0, 50) + '...' : 'UNDEFINED');
        
        // Lưu token và user info
        try {
          localStorage.setItem('seafresh_token', result.token);
          localStorage.setItem('seafresh_user', JSON.stringify(result.user || {}));
          console.log('[AUTH PAGE] ✓ Saved to localStorage successfully');
        } catch (e) {
          console.error('[AUTH PAGE] ❌ Error saving to localStorage:', e);
        }

        // Verify saved data
        const savedToken = localStorage.getItem('seafresh_token');
        const savedUserStr = localStorage.getItem('seafresh_user');
        console.log('[AUTH PAGE] After save - Token:', !!savedToken ? 'EXISTS (' + savedToken.length + ' chars)' : 'EMPTY');
        console.log('[AUTH PAGE] After save - User:', !!savedUserStr ? 'EXISTS' : 'EMPTY');
        
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
        console.log('[AUTH PAGE] Parsed user:', savedUser);
        
        // Kiểm tra role một cách chi tiết
        const user = result.user;
        const roleRaw = user?.role;
        const userRole = (roleRaw || '').toLowerCase().trim();
        const isAdmin = userRole === 'admin';
        
        console.log('[AUTH PAGE] Role analysis:');
        console.log('  - user:', user);
        console.log('  - roleRaw:', roleRaw, '(type: ' + typeof roleRaw + ')');
        console.log('  - userRole:', userRole);
        console.log('  - isAdmin:', isAdmin);
        console.log('[AUTH PAGE] ============ LOGIN FLOW END ============');

        // Redirect admin ngay lập tức đến Admin Dashboard
        if (isAdmin) {
          console.log('[AUTH PAGE] ✅ ADMIN DETECTED - navigating to /admin');
          navigate('/admin', { replace: true });
          return;
        }

        // Sync localStorage cart to database after login (chỉ cho customer)
        try {
          await syncLocalCartToDatabase();
        } catch (error) {
          console.error('Error syncing cart:', error);
          // Don't block login if cart sync fails
        }

        // Redirect customer đến Customer Portal
        console.log('[AUTH PAGE] ✅ REDIRECTING TO /customer');
        navigate('/customer', { replace: true });
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
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <div className="logo-mark large" aria-label="SeaFresh logo" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                  <span role="img" aria-hidden="true">🌊</span>
                </div>
              </Link>
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


