# Hướng dẫn Debug Admin Login

## Vấn đề
Admin không thể vào trang admin sau khi đăng nhập.

## Các bước kiểm tra

### 1. Kiểm tra Console Logs
Mở Developer Tools (F12) và kiểm tra Console khi đăng nhập admin:

1. **Trong AuthController** - Kiểm tra response từ API:
   - `[AUTH CONTROLLER] Login response:` - Xem cấu trúc response
   - `[AUTH CONTROLLER] Extracted user:` - Xem user object
   - `[AUTH CONTROLLER] User role:` - Xem role có phải 'admin' không

2. **Trong AuthPage** - Kiểm tra logic redirect:
   - `[AUTH PAGE] Login successful`
   - `[AUTH PAGE] User role:` - Phải là 'admin'
   - `[AUTH PAGE] Is admin:` - Phải là true
   - `[AUTH PAGE] Redirecting admin to /admin`

3. **Trong ProtectedRoute** - Kiểm tra bảo vệ route:
   - `[PROTECTED ROUTE] User role:` - Phải là 'admin'
   - `[PROTECTED ROUTE] Is admin:` - Phải là true
   - `[PROTECTED ROUTE] Access granted`

### 2. Kiểm tra LocalStorage
Sau khi đăng nhập, kiểm tra localStorage:
```javascript
// Trong Console
localStorage.getItem('seafresh_token') // Phải có token
localStorage.getItem('seafresh_user') // Phải có user object
JSON.parse(localStorage.getItem('seafresh_user')).role // Phải là 'admin'
```

### 3. Kiểm tra Response từ Backend
Backend phải trả về:
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "email": "admin@example.com",
      "role": "admin",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Kiểm tra User trong Database
Đảm bảo user có role = 'admin' trong database:
```javascript
// Trong MongoDB
db.Users.findOne({ email: "admin@example.com" })
// Kiểm tra field "role" phải là "admin"
```

## Các nguyên nhân có thể

1. **Response structure không đúng**: apiClient đã unwrap response.data, cần kiểm tra lại cách truy cập user và token
2. **Role không đúng**: User trong database không có role = 'admin'
3. **LocalStorage không được set**: Token hoặc user không được lưu vào localStorage
4. **ProtectedRoute chặn**: ProtectedRoute không nhận diện được admin role

## Giải pháp đã áp dụng

1. ✅ Thêm nhiều console.log để debug
2. ✅ Cải thiện logic extract user và token từ response
3. ✅ Thêm error handling khi parse user data
4. ✅ Sử dụng setTimeout để đảm bảo localStorage được set trước khi redirect
5. ✅ Cải thiện ProtectedRoute với logging chi tiết

## Test Case

1. Đăng nhập với tài khoản admin
2. Kiểm tra console logs
3. Kiểm tra localStorage
4. Kiểm tra URL có chuyển đến /admin không
5. Kiểm tra Admin Dashboard có hiển thị không

## Nếu vẫn không hoạt động

1. Xóa cache và localStorage:
```javascript
localStorage.clear();
sessionStorage.clear();
```

2. Kiểm tra lại user trong database có role = 'admin'

3. Kiểm tra Network tab xem API response có đúng không

4. Kiểm tra có lỗi CORS hoặc authentication không

