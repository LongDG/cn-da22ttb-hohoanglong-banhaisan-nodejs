import React, { useState, useEffect } from 'react';

const VoucherList = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vouchers from API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/vouchers');
        const result = await response.json();
        
        if (result.success) {
          // Map database format to UI format
          const mappedVouchers = result.data.map(voucher => ({
            id: voucher.voucher_id,
            code: voucher.code,
            discount: voucher.discount_type === 'percentage' 
              ? `${voucher.value}%` 
              : `${voucher.value.toLocaleString('vi-VN')}đ`,
            description: voucher.description || getDefaultDescription(voucher),
            expiryDate: formatDate(voucher.expiry_date),
            minOrder: voucher.min_order_value || 0,
            rawData: voucher
          }));
          setVouchers(mappedVouchers);
        } else {
          setError('Không thể tải danh sách voucher');
        }
      } catch (err) {
        console.error('Error fetching vouchers:', err);
        setError('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Format date from ISO to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'Không giới hạn';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Generate default description based on voucher data
  const getDefaultDescription = (voucher) => {
    if (voucher.discount_type === 'percentage') {
      return `Giảm ${voucher.value}% cho đơn hàng${voucher.min_order_value ? ` từ ${voucher.min_order_value.toLocaleString('vi-VN')}đ` : ''}`;
    } else {
      return `Giảm ${voucher.value.toLocaleString('vi-VN')}đ cho đơn hàng${voucher.min_order_value ? ` từ ${voucher.min_order_value.toLocaleString('vi-VN')}đ` : ''}`;
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="voucher-list-container" style={{ padding: '2rem', backgroundColor: '#f0f9ff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#0369a1',
            marginBottom: '0.5rem'
          }}>
            🎟️ Mã Giảm Giá Hấp Dẫn
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Sao chép mã và áp dụng ngay khi thanh toán
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ 
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid #e2e8f0',
              borderTop: '5px solid #0284c7',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Đang tải voucher...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            color: '#991b1b'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && vouchers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
            <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>Chưa có voucher nào</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Vui lòng quay lại sau để nhận ưu đãi hấp dẫn!
            </p>
          </div>
        )}

        {/* Voucher Grid */}
        {!loading && !error && vouchers.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Perforated line effect using pseudo-elements */}
              <div style={{ position: 'relative' }}>
                {/* Top section - Discount badge */}
                <div style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  padding: '1.5rem',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {voucher.discount}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    opacity: 0.9
                  }}>
                    GIẢM GIÁ
                  </div>

                  {/* Decorative circles */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '-12px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    right: '-12px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '50%'
                  }} />
                </div>

                {/* Dashed line separator */}
                <div style={{
                  height: '2px',
                  background: 'repeating-linear-gradient(to right, #cbd5e1 0px, #cbd5e1 8px, transparent 8px, transparent 16px)',
                  margin: '0'
                }} />

                {/* Bottom section - Details */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Voucher Code */}
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    border: '2px dashed #0284c7',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      color: '#0369a1',
                      letterSpacing: '0.05em'
                    }}>
                      {voucher.code}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    marginBottom: '0.75rem',
                    minHeight: '40px'
                  }}>
                    {voucher.description}
                  </p>

                  {/* Expiry date */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ marginRight: '0.25rem' }}>🕒</span>
                    HSD: {voucher.expiryDate}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopyCode(voucher.code)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: copiedCode === voucher.code ? '#10b981' : '#0284c7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (copiedCode !== voucher.code) {
                        e.currentTarget.style.backgroundColor = '#0369a1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedCode !== voucher.code) {
                        e.currentTarget.style.backgroundColor = '#0284c7';
                      }
                    }}
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <span>✓</span>
                        <span>Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>Sao chép mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Info note */}
        {!loading && !error && vouchers.length > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              💡 <strong>Lưu ý:</strong> Mỗi mã chỉ áp dụng một lần cho mỗi đơn hàng. 
              Không áp dụng đồng thời nhiều mã giảm giá.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherList;
