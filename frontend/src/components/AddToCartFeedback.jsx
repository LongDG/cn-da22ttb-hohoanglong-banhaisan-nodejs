import { useEffect, useState } from 'react';

// Lightweight feedback modal: shows loading, then success check
const AddToCartFeedback = ({ show, onClose, onGoToCart }) => {
  const [phase, setPhase] = useState('loading'); // loading | success

  useEffect(() => {
    if (!show) return;
    setPhase('loading');
    const t = setTimeout(() => setPhase('success'), 800);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-icon">
          {phase === 'loading' ? (
            <div className="spinner" aria-label="Đang xử lý" />
          ) : (
            <div className="checkmark" aria-label="Thành công">
              <svg viewBox="0 0 52 52" width="64" height="64">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#22c55e" strokeWidth="3" />
                <path d="M14 27 L23 35 L38 18" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
        <div className="feedback-text">
          {phase === 'loading' ? 'Đang thêm vào giỏ hàng...' : 'Đã thêm vào giỏ hàng!'}
        </div>
        <div className="feedback-actions">
          <button className="btn-secondary" onClick={onClose}>Tiếp tục xem</button>
          <button className="btn-primary" onClick={onGoToCart}>Xem giỏ hàng</button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartFeedback;
