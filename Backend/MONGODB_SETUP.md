# Hướng dẫn thiết lập MongoDB

## 1. Cài đặt MongoDB

### Windows
1. Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
2. Cài đặt MongoDB
3. MongoDB sẽ chạy mặc định tại `localhost:27017`

### MacOS
```bash
brew install mongodb-community
brew services start mongodb-community
```

### Linux
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## 2. Cấu hình kết nối

Tạo file `.env` trong thư mục `Backend/` với nội dung:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
```

Hoặc nếu MongoDB có authentication:
```env
MONGODB_URI=mongodb://username:password@localhost:27017/ecommerce
```

## 3. Cài đặt dependencies

```bash
cd Backend
npm install
```

## 4. Seed dữ liệu mẫu

Chạy script seed để thêm dữ liệu mẫu vào MongoDB:

```bash
npm run seed
```

Script này sẽ:
- Xóa tất cả dữ liệu cũ (nếu có)
- Thêm dữ liệu mẫu vào database

## 5. Chạy server

```bash
npm start
# hoặc
npm run dev  # với nodemon
```

## 6. Kiểm tra kết nối

Server sẽ hiển thị thông báo khi kết nối MongoDB thành công:
```
MongoDB Connected: localhost
Database: ecommerce
Server is running on port 3000
```

## Cấu trúc Database

Database name: `ecommerce`

Collections:
- `users`
- `addresses`
- `categories`
- `suppliers`
- `products`
- `product_variants`
- `reviews`
- `orders`
- `order_items`
- `payments`
- `vouchers`

## Sử dụng MongoDB Compass (Optional)

MongoDB Compass là GUI tool để quản lý MongoDB:
1. Tải từ: https://www.mongodb.com/try/download/compass
2. Kết nối với: `mongodb://localhost:27017`
3. Xem database `ecommerce` và các collections

## Troubleshooting

### Lỗi kết nối MongoDB
- Đảm bảo MongoDB đang chạy
- Kiểm tra port 27017 có bị block không
- Kiểm tra file `.env` có đúng cấu hình không

### Lỗi seed data
- Đảm bảo MongoDB đã kết nối thành công
- Kiểm tra database có tồn tại không
- Chạy lại `npm run seed`

## Xóa database (nếu cần)

```bash
# Sử dụng MongoDB shell
mongo
use ecommerce
db.dropDatabase()
```

Hoặc sử dụng MongoDB Compass để xóa database.

