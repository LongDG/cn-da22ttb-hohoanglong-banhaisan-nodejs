import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCartItemCount } from '../services/cartService';

const CartBadge = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('seafresh_token');
      // Token check (for future auth features)
      return !!token;
    };

    const fetchCount = async () => {
      try {
        const count = await getCartItemCount();
        setItemCount(count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    checkAuth();
    fetchCount();

    // Listen to storage (login/logout) and custom cart events
    window.addEventListener('storage', checkAuth);
    const handleCartUpdate = () => fetchCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      getCartItemCount().then(setItemCount).catch(console.error);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  if (itemCount === 0) return null;

  return (
    <Link 
      to="/cart"
      className="icon-btn cart-badge tooltip"
      data-label="Giỏ hàng"
      aria-label="Giỏ hàng"
      title="Giỏ hàng"
      style={{ position: 'relative' }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M3 3h2l2.4 12.1a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L21 7H6" stroke="#cbd5f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="20" r="1.6" fill="#cbd5f5"/>
        <circle cx="17" cy="20" r="1.6" fill="#cbd5f5"/>
      </svg>
      {itemCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#ef4444',
            color: '#fff',
            borderRadius: '50%',
            minWidth: '20px',
            height: '20px',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 0 0 2px rgba(15,23,42,0.95)'
          }}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;

