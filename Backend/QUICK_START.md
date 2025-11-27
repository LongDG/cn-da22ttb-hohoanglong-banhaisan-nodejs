# Hướng dẫn nhanh - Seed dữ liệu

## Vấn đề: Database trống

Nếu API trả về kết quả như này:
```json
{
    "success": true,
    "data": [],
    "count": 0
}
```

Điều này có nghĩa là database chưa có dữ liệu. Bạn cần seed dữ liệu mẫu.

## Các bước để seed dữ liệu:

### 1. Đảm bảo MongoDB đang chạy
```bash
# Kiểm tra MongoDB có đang chạy không
# Windows: Kiểm tra trong Services
# Mac/Linux: 
ps aux | grep mongod
```

### 2. Chạy script seed
```bash
cd Backend
npm run seed
```

### 3. Kiểm tra kết quả
Sau khi chạy `npm run seed`, bạn sẽ thấy output như sau:
```
MongoDB Connected: localhost
Database: ecommerce
Cleared existing data
Seeded 2 users
Seeded 2 addresses
Seeded 3 categories
Seeded 1 suppliers
Seeded 2 products
Seeded 2 product variants
Seeded 2 reviews
Seeded 1 orders
Seeded 2 order items
Seeded 1 payments
Seeded 2 vouchers
Seed data completed successfully!
```

### 4. Test API lại
Sau khi seed xong, test lại API:
```bash
GET http://localhost:3000/api/users
```

Bây giờ bạn sẽ thấy dữ liệu:
```json
{
    "success": true,
    "data": [
        {
            "user_id": 1,
            "full_name": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            ...
        },
        {
            "user_id": 2,
            "full_name": "Trần Thị B",
            "email": "tranthib@example.com",
            ...
        }
    ],
    "count": 2
}
```

## Lưu ý

- Script seed sẽ **xóa tất cả dữ liệu cũ** và thêm dữ liệu mẫu mới
- Nếu bạn đã có dữ liệu và muốn giữ lại, hãy backup trước khi chạy seed
- Bạn có thể chạy `npm run seed` nhiều lần, nó sẽ xóa và thêm lại dữ liệu

## Troubleshooting

### Lỗi: Cannot connect to MongoDB
- Đảm bảo MongoDB đang chạy
- Kiểm tra MongoDB URI trong file `.env`: `MONGODB_URI=mongodb://localhost:27017/ecommerce`
- Thử kết nối bằng MongoDB Compass hoặc `mongosh`

### Lỗi: E11000 duplicate key error
- Điều này có nghĩa là dữ liệu đã tồn tại
- Script seed sẽ tự động xóa dữ liệu cũ trước khi thêm mới
- Nếu vẫn lỗi, thử xóa database và chạy lại seed

### Lỗi: Module not found
- Chạy `npm install` để cài đặt dependencies
- Đảm bảo đang ở đúng thư mục `Backend`

