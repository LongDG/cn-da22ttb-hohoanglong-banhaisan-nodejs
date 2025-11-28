const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('seafresh_user') || '{}');

  return (
    <section>
      <h1>Thông tin tài khoản</h1>
      <ul>
        <li>Họ tên: {user.full_name || 'Chưa cập nhật'}</li>
        <li>Email: {user.email}</li>
        <li>Số điện thoại: {user.phone_number || 'Chưa cập nhật'}</li>
      </ul>
    </section>
  );
};

export default ProfilePage;

