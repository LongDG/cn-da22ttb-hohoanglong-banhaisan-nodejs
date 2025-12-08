import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('seafresh_token');
  const userStr = localStorage.getItem('seafresh_user');
  
  console.log('[PROTECTED ROUTE] Checking access...');
  console.log('[PROTECTED ROUTE] Token exists:', !!token);
  console.log('[PROTECTED ROUTE] User string:', userStr);
  
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('[PROTECTED ROUTE] Error parsing user:', error);
    localStorage.removeItem('seafresh_token');
    localStorage.removeItem('seafresh_user');
    return <Navigate to="/auth" replace />;
  }

  if (!token || !user) {
    console.log('[PROTECTED ROUTE] No token or user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  const role = (user.role || '').toLowerCase();
  const isAdmin = role === 'admin';
  console.log('[PROTECTED ROUTE] User role:', user.role);
  console.log('[PROTECTED ROUTE] Is admin:', isAdmin);
  console.log('[PROTECTED ROUTE] Require admin:', requireAdmin);

  // Nếu route yêu cầu admin nhưng user không phải admin
  if (requireAdmin && !isAdmin) {
    console.log('[PROTECTED ROUTE] Admin required but user is not admin, redirecting to customer');
    return <Navigate to="/customer" replace />;
  }

  // Nếu route là customer nhưng user là admin, redirect đến admin
  if (!requireAdmin && isAdmin) {
    console.log('[PROTECTED ROUTE] Customer route accessed by admin, redirecting to admin');
    return <Navigate to="/admin" replace />;
  }

  console.log('[PROTECTED ROUTE] Access granted');
  return children;
};

export default ProtectedRoute;

