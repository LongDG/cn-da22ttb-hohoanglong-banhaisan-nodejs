# So sánh server.js và server-memory.js

## 📊 Bảng so sánh

| Tính năng | `server.js` | `server-memory.js` |
|-------------|-------------|-------------------|
| **Yêu cầu MongoDB** | ✅ Cần MongoDB thật | ❌ Không cần |
| **Cài đặt MongoDB** | ✅ Phải cài | ❌ Không cần |
| **Dữ liệu lưu trữ** | ✅ Lưu vĩnh viễn | ❌ Mất khi restart |
| **Phù hợp cho** | Production/Development | Testing/Development tạm thời |
| **Tốc độ** | Nhanh | Rất nhanh |
| **Dung lượng** | Không giới hạn | Giới hạn bởi RAM |

## 🚀 Cách chạy

### server.js (MongoDB thật)

**Yêu cầu:**
- MongoDB đã được cài đặt và đang chạy
- Hoặc MongoDB Atlas (cloud)

**Chạy:**
```bash
npm start
# hoặc
npm run dev
```

**Seed dữ liệu:**
```bash
npm run seed
```

### server-memory.js (In-Memory - Không cần MongoDB)

**Yêu cầu:**
- Chỉ cần Node.js
- Không cần cài MongoDB

**Chạy:**
```bash
npm run start:memory
# hoặc
npm run dev:memory
```

**Seed dữ liệu:**
```bash
# Cách 1: Qua API (khuyến nghị)
# Sau khi server đã chạy, gửi POST request đến:
# http://localhost:3000/api/seed

# Cách 2: Chạy script riêng (sẽ tạo DB mới, không khuyến nghị)
npm run seed:memory
```

## ⚙️ Cấu hình

### server.js

Tạo file `.env` trong thư mục Backend:

```env
MONGODB_URI=mongodb://localhost:27017/BIENTUOI_DB
PORT=3000
JWT_SECRET=your_secret_key_here
```

### server-memory.js

Không cần file `.env` (nhưng nên có JWT_SECRET):

```env
PORT=3000
JWT_SECRET=your_secret_key_here
```

## 🔄 Chuyển đổi giữa 2 chế độ

### Dùng server.js với in-memory (tự động)

Nếu set biến môi trường `USE_MEMORY_DB=true`, `server.js` sẽ tự động dùng in-memory:

```bash
# Windows PowerShell
$env:USE_MEMORY_DB="true"
npm start

# Linux/Mac
USE_MEMORY_DB=true npm start
```

Hoặc trong file `.env`:
```env
USE_MEMORY_DB=true
```

## 💡 Khuyến nghị

### Máy công cộng / Không có MongoDB
✅ Dùng `server-memory.js`:
```bash
npm run start:memory
```

### Máy cá nhân / Có MongoDB
✅ Dùng `server.js`:
```bash
npm start
```

### Development / Testing
✅ Dùng `server-memory.js` (nhanh, không cần setup)

### Production
✅ Dùng `server.js` với MongoDB thật (dữ liệu lưu vĩnh viễn)

## 🐛 Troubleshooting

### server.js không kết nối được MongoDB

**Lỗi:** `MongoDB connection error`

**Giải pháp:**
1. Kiểm tra MongoDB có đang chạy không:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

2. Kiểm tra connection string trong `.env`

3. Hoặc chuyển sang dùng `server-memory.js`:
   ```bash
   npm run start:memory
   ```

### server-memory.js mất dữ liệu sau restart

**Đây là hành vi bình thường!** In-memory database không lưu dữ liệu.

**Giải pháp:**
- Seed lại sau mỗi lần restart:
  ```bash
  # Gửi POST request đến http://localhost:3000/api/seed
  ```

## 📝 Tóm tắt

| Tình huống | Dùng file nào |
|-----------|---------------|
| Không có MongoDB | `server-memory.js` |
| Có MongoDB | `server.js` |
| Test nhanh | `server-memory.js` |
| Production | `server.js` |

