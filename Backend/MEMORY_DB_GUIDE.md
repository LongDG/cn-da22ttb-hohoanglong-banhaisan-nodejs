# Hướng dẫn sử dụng MongoDB In-Memory (Không cần cài MongoDB)

## 🎯 Khi nào sử dụng?

- ✅ Máy công cộng, không có quyền cài đặt MongoDB
- ✅ Test nhanh mà không muốn cài đặt
- ✅ Development tạm thời
- ✅ CI/CD testing

## ⚠️ Lưu ý

- Dữ liệu sẽ **MẤT KHI SERVER DỪNG**
- Chỉ phù hợp cho **testing/development**
- **KHÔNG** dùng cho production

## 📦 Cài đặt

```bash
cd Backend
npm install
```

Package `mongodb-memory-server` sẽ được cài tự động.

## 🚀 Cách sử dụng

### 1. Chạy Server với In-Memory Database

```bash
npm run start:memory
```

Hoặc với auto-reload:

```bash
npm run dev:memory
```

### 2. Seed dữ liệu vào In-Memory Database

Mở terminal mới và chạy:

```bash
npm run seed:memory
```

Sau đó quay lại terminal server, dữ liệu đã được seed.

### 3. Test API

Server sẽ chạy tại: `http://localhost:3000`

API endpoints giống như bình thường:
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/auth/login` - Đăng nhập
- `GET /api/orders` - Lấy đơn hàng
- ... và các endpoints khác

## 📋 Tài khoản test

Sau khi chạy `npm run seed:memory`, bạn có thể đăng nhập với:

- **Customer**: `customer@test.com` / `123456`
- **Admin**: `admin@test.com` / `admin123`
- **Customer**: `cuong@test.com` / `123456`
- **Customer**: `dung@test.com` / `123456`

## 🔄 Workflow đề xuất

1. **Terminal 1**: Chạy server
   ```bash
   npm run start:memory
   ```

2. **Terminal 2**: Seed dữ liệu
   ```bash
   npm run seed:memory
   ```

3. **Terminal 3**: Test API hoặc chạy frontend
   ```bash
   # Test với curl hoặc Postman
   curl http://localhost:3000/api/products
   ```

## 💡 Tips

- Mỗi lần restart server, dữ liệu sẽ mất → cần seed lại
- Có thể tạo script tự động seed khi server start
- In-memory database rất nhanh, phù hợp cho testing

## 🔧 Tùy chỉnh

Nếu muốn dùng in-memory trong code, set biến môi trường:

```bash
# Windows
set USE_MEMORY_DB=true
npm start

# Linux/Mac
USE_MEMORY_DB=true npm start
```

Hoặc tạo file `.env`:

```env
USE_MEMORY_DB=true
PORT=3000
JWT_SECRET=your_secret_key
```

## ❓ Troubleshooting

### Lỗi: "Cannot find module 'mongodb-memory-server'"
```bash
npm install mongodb-memory-server --save-dev
```

### Server không start
- Kiểm tra port 3000 có bị chiếm không
- Xem log lỗi trong console

### Dữ liệu mất sau khi restart
- Đây là hành vi bình thường của in-memory database
- Cần chạy `npm run seed:memory` lại sau mỗi lần restart

## 🆚 So sánh với MongoDB thật

| Tính năng | MongoDB In-Memory | MongoDB thật |
|-----------|-------------------|--------------|
| Cài đặt | Không cần | Cần cài |
| Tốc độ | Rất nhanh | Nhanh |
| Dữ liệu | Mất khi restart | Lưu vĩnh viễn |
| Phù hợp | Testing/Dev | Production |
| Dung lượng | Giới hạn RAM | Không giới hạn |

