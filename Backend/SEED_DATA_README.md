# Hướng dẫn sử dụng Seed Data

## Chạy seed data

```bash
cd Backend
npm run seed
```

Hoặc:

```bash
cd Backend
node seedData.js
```

## Dữ liệu được tạo

### 👥 Users (4 users)
- **Customer**: customer@test.com / 123456
- **Admin**: admin@test.com / admin123
- **Customer**: cuong@test.com / 123456
- **Customer**: dung@test.com / 123456

### 📍 Addresses (3 addresses)
- 2 địa chỉ cho user 1
- 1 địa chỉ cho user 3

### 🏷️ Categories (9 categories)
- Tôm, Cua, Cá, Mực, Nghêu Sò Ốc
- Và các sub-categories

### 🏭 Suppliers (4 suppliers)
- Vựa Hải Sản Vũng Tàu
- Hải Sản Cà Mau
- Nhập Khẩu Hải Sản Na Uy
- Hải Sản Phú Quốc

### 🦐 Products (8 products)
1. Tôm sú thiên nhiên
2. Cá hồi Na Uy
3. Cua hoàng đế Alaska
4. Mực ống tươi
5. Tôm hùm bông
6. Nghêu hạt
7. Cá thu đao
8. Sò điệp

### 📦 Product Variants (18 variants)
- Mỗi sản phẩm có 2-3 biến thể (size/khối lượng khác nhau)
- Có giá gốc và giá khuyến mãi
- Có số lượng tồn kho

### ⭐ Reviews (4 reviews)
- Đánh giá từ các khách hàng

### 🛒 Orders (3 orders)
- Order 1001: completed (user 1)
- Order 1002: processing (user 1)
- Order 1003: pending (user 3)

### 📋 Order Items (5 items)
- Chi tiết các sản phẩm trong đơn hàng

### 💳 Payments (3 payments)
- Thanh toán cho các đơn hàng

### 🎫 Vouchers (4 vouchers)
- SALE50K: Giảm 50,000đ
- SALE10P: Giảm 10%
- WELCOME100K: Giảm 100,000đ
- SALE20P: Giảm 20%

## Lưu ý

⚠️ **Chạy seed sẽ xóa TẤT CẢ dữ liệu hiện có** trong database và tạo lại từ đầu.

Đảm bảo MongoDB đang chạy trước khi chạy seed:
```bash
# Kiểm tra MongoDB
mongosh
```

Hoặc nếu dùng MongoDB Atlas, đảm bảo connection string đúng trong file `.env`.

