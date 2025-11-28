import '../styles/customer.css';

const CustomerPortal = () => {
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  return (
    <section>
      <h1>Xin chào {user.full_name || user.email || 'bạn'}</h1>
      <p>Đây là bảng điều khiển dành cho khách hàng SeaFresh.</p>
      <div className="customer-stats">
        <article>
          <h2>0</h2>
          <p>Đơn chờ xử lý</p>
        </article>
        <article>
          <h2>0</h2>
          <p>Voucher đang có</p>
        </article>
        <article>
          <h2>0₫</h2>
          <p>Chi tiêu tháng này</p>
        </article>
      </div>
    </section>
  );
};

export default CustomerPortal;

