# Troubleshooting - Database trống

## Vấn đề: API trả về `data: []` và `count: 0`

### Nguyên nhân có thể:
1. **Server chưa được restart** sau khi seed data
2. **Server đang kết nối đến database khác**
3. **MongoDB connection có vấn đề**

## Giải pháp:

### Bước 1: Kiểm tra dữ liệu trong MongoDB

Chạy lệnh này để kiểm tra xem dữ liệu có trong database không:

```bash
npm run test-db
```

Nếu thấy dữ liệu (2 users, 2 products, etc.) → Dữ liệu đã có, vấn đề ở server
Nếu không thấy dữ liệu → Chạy seed lại: `npm run seed`

### Bước 2: Restart Server

**Quan trọng**: Sau khi seed data, bạn **PHẢI restart server** để server kết nối lại với database.

1. **Dừng server hiện tại** (Ctrl + C)
2. **Start lại server**:
   ```bash
   npm start
   # hoặc
   npm run dev
   ```

### Bước 3: Kiểm tra Connection

Kiểm tra xem server có kết nối đúng database không. Server sẽ hiển thị:

```
MongoDB Connected: localhost
Database: ecommerce
Server is running on port 3000
```

### Bước 4: Test API

Sau khi restart server, test lại API:

```bash
GET http://localhost:3000/api/users
```

Bây giờ sẽ thấy dữ liệu:
```json
{
    "success": true,
    "data": [
        {
            "user_id": 1,
            "full_name": "Nguyễn Văn A",
            ...
        }
    ],
    "count": 2
}
```

## Checklist:

- [ ] MongoDB đang chạy
- [ ] Đã chạy `npm run seed` và thấy "Seed data completed successfully!"
- [ ] Đã restart server sau khi seed
- [ ] Server hiển thị "MongoDB Connected: localhost"
- [ ] Test với `npm run test-db` thấy có dữ liệu
- [ ] API endpoint trả về dữ liệu

## Lệnh nhanh:

```bash
# 1. Kiểm tra dữ liệu
npm run test-db

# 2. Nếu không có dữ liệu, seed lại
npm run seed

# 3. Restart server
# Dừng server (Ctrl + C) rồi:
npm start
```

## Vẫn không được?

1. **Kiểm tra MongoDB URI** trong file `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

2. **Kiểm tra MongoDB có đang chạy**:
   - Windows: Kiểm tra Services
   - Mac/Linux: `ps aux | grep mongod`

3. **Kiểm tra database name**:
   - Đảm bảo đang dùng database `ecommerce`
   - Có thể dùng MongoDB Compass để kiểm tra

4. **Xóa và tạo lại database**:
   ```bash
   # Trong MongoDB shell hoặc Compass
   use ecommerce
   db.dropDatabase()
   
   # Sau đó seed lại
   npm run seed
   ```

