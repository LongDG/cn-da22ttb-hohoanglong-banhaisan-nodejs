# 🔧 Khắc phục lỗi đăng nhập

## ❌ Lỗi: "Email hoặc mật khẩu không đúng"

### Nguyên nhân có thể:

1. **Backend server chưa chạy**
2. **Dữ liệu chưa được seed** (user chưa tồn tại trong database)
3. **Password không đúng**

## ✅ Giải pháp

### Bước 1: Kiểm tra Backend Server

Đảm bảo backend đang chạy:

```bash
# Nếu dùng in-memory database
npm run start:memory

# Hoặc nếu dùng MongoDB thật
npm start
```

Server phải chạy tại: `http://localhost:3000`

### Bước 2: Seed dữ liệu

Nếu dùng in-memory database, chạy seed:

```bash
npm run seed:memory
```

Nếu dùng MongoDB thật:

```bash
npm run seed
```

### Bước 3: Kiểm tra tài khoản

Sau khi seed, các tài khoản sau sẽ có sẵn:

#### 👤 Admin
- **Email**: `admin@test.com`
- **Password**: `admin123`

#### 👤 Customer
- **Email**: `customer@test.com`
- **Password**: `123456`

#### 👤 Customer 2
- **Email**: `cuong@test.com`
- **Password**: `123456`

#### 👤 Customer 3
- **Email**: `dung@test.com`
- **Password**: `123456`

## 🔍 Kiểm tra chi tiết

### 1. Kiểm tra Backend có đang chạy

Mở trình duyệt hoặc dùng curl:

```bash
curl http://localhost:3000
```

Hoặc mở: `http://localhost:3000` trong trình duyệt

Kết quả mong đợi:
```json
{
  "message": "Backend MVC API is running",
  "database": "MongoDB"
}
```

### 2. Kiểm tra API Login

Test trực tiếp với curl hoặc Postman:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

Kết quả mong đợi:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

### 3. Kiểm tra Frontend API URL

Đảm bảo frontend đang gọi đúng URL:

- Kiểm tra file `.env` trong frontend:
  ```
  REACT_APP_API_URL=http://localhost:3000
  ```

- Hoặc kiểm tra `frontend/src/services/apiClient.js`:
  ```javascript
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  ```

## 🐛 Debug Steps

### Nếu vẫn lỗi:

1. **Mở Developer Tools** (F12) trong trình duyệt
2. Vào tab **Network**
3. Thử đăng nhập lại
4. Xem request đến `/api/auth/login`
5. Kiểm tra:
   - Status code (200 = OK, 400 = Bad Request, 500 = Server Error)
   - Response body
   - Request payload

### Logs từ Backend

Kiểm tra console của backend server để xem:
- Có request đến không?
- Có lỗi gì không?
- User có được tìm thấy không?

## 💡 Lưu ý

- ⚠️ Nếu dùng **in-memory database**, mỗi lần restart server cần seed lại
- ⚠️ Password phân biệt hoa thường
- ⚠️ Email phải chính xác (không có khoảng trắng)

## 📞 Test nhanh

Copy và chạy trong PowerShell để test:

```powershell
$body = @{
    email = "admin@test.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
    -Uri "http://localhost:3000/api/auth/login" `
    -Body $body `
    -ContentType "application/json"
```

Nếu thành công, bạn sẽ thấy token và user info.

