const RoleSwitcher = ({ selectedRole, onChange, mode, onModeChange }) => {
  const roles = [
    { id: 'user', label: 'Người dùng' },
    { id: 'admin', label: 'Quản trị' },
  ];

  const modes = [
    { id: 'login', label: 'Đăng nhập' },
    { id: 'register', label: 'Đăng ký' },
  ];

  return (
    <div className="role-switcher">
      <div className="switcher-block">
        <p>Chọn vai trò</p>
        <div className="switcher-options">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={role.id === selectedRole ? 'active' : ''}
              onClick={() => onChange(role.id)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="switcher-block">
        <p>Chọn chế độ</p>
        <div className="switcher-options">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === mode ? 'active' : ''}
              onClick={() => onModeChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;

