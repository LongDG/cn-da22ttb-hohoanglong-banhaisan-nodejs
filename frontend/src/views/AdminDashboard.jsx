import '../styles/admin.css';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  return (
    <main className="secure-shell admin">
      <section className="secure-card">
        <h1>Trang quản trị</h1>
        <p>Xin chào {user.full_name || user.email || 'Admin'}!</p>
        <p>Bạn đang đăng nhập với vai trò <strong>{user.role || 'admin'}</strong>.</p>
        <p>Hãy tiếp tục xây dựng các module quản trị tại đây.</p>
      </section>
    </main>
  );
};

export default AdminDashboard;

