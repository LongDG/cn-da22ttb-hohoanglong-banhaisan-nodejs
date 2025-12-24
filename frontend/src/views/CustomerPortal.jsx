import { useEffect, useState } from 'react';
import '../styles/customer.css';
import { getOrders } from '../services/orderService';

const CustomerPortal = () => {
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');
  const [stats, setStats] = useState({
    pendingOrders: 0,
    vouchers: 0,
    monthlySpending: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.user_id) {
          // Fetch orders
          const ordersRes = await getOrders({ userId: user.user_id });
          const orders = ordersRes.data || [];
          
          const pendingOrders = orders.filter(order => 
            order.status === 'pending' || order.status === 'processing'
          ).length;
          
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const monthlySpending = orders
            .filter(order => {
              const orderDate = new Date(order.order_date);
              return orderDate.getMonth() === currentMonth && 
                     orderDate.getFullYear() === currentYear &&
                     order.status !== 'cancelled';
            })
            .reduce((sum, order) => sum + (order.total_amount || 0), 0);
          
          // Fetch vouchers
          let validVouchersCount = 0;
          try {
            const vouchersRes = await fetch('http://localhost:3000/api/vouchers');
            const vouchersData = await vouchersRes.json();
            
            if (vouchersData.success) {
              // Count only valid vouchers (not expired and has usage limit)
              const now = new Date();
              validVouchersCount = vouchersData.data.filter(voucher => {
                const isNotExpired = !voucher.expiry_date || new Date(voucher.expiry_date) > now;
                const hasUsageLeft = !voucher.usage_limit || voucher.usage_limit > 0;
                return isNotExpired && hasUsageLeft;
              }).length;
            }
          } catch (voucherError) {
            console.error('Error fetching vouchers:', voucherError);
          }
          
          setStats({
            pendingOrders,
            vouchers: validVouchersCount,
            monthlySpending,
            loading: false
          });
        } else {
          setStats(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [user.user_id]);

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <section>
      <h1>Xin chào {user.full_name || user.email || 'bạn'}</h1>
      <p>Đây là bảng điều khiển dành cho khách hàng SeaFresh.</p>
      {stats.loading ? (
        <p>Đang tải thống kê...</p>
      ) : (
        <div className="customer-stats">
          <article>
            <h2>{stats.pendingOrders}</h2>
            <p>Đơn chờ xử lý</p>
          </article>
          <article>
            <h2>{stats.vouchers}</h2>
            <p>Voucher đang có</p>
          </article>
          <article>
            <h2>{formatCurrency(stats.monthlySpending)}</h2>
            <p>Chi tiêu tháng này</p>
          </article>
        </div>
      )}
    </section>
  );
};

export default CustomerPortal;

