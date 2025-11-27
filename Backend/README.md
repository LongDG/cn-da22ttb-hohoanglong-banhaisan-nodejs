# Backend API - Hệ thống E-commerce Hải sản

Backend API được xây dựng theo mô hình MVC (Model-View-Controller) sử dụng Node.js và Express.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### 1. Users
- `GET /api/users` - Lấy tất cả users
- `GET /api/users/:id` - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### 2. Addresses
- `GET /api/addresses` - Lấy tất cả addresses
- `GET /api/addresses?userId=1` - Lấy addresses theo userId
- `GET /api/addresses/:id` - Lấy address theo ID
- `POST /api/addresses` - Tạo address mới
- `PUT /api/addresses/:id` - Cập nhật address
- `DELETE /api/addresses/:id` - Xóa address

### 3. Categories
- `GET /api/categories` - Lấy tất cả categories
- `GET /api/categories?parentId=1` - Lấy categories theo parentId
- `GET /api/categories/:id` - Lấy category theo ID
- `POST /api/categories` - Tạo category mới
- `PUT /api/categories/:id` - Cập nhật category
- `DELETE /api/categories/:id` - Xóa category

### 4. Suppliers
- `GET /api/suppliers` - Lấy tất cả suppliers
- `GET /api/suppliers/:id` - Lấy supplier theo ID
- `POST /api/suppliers` - Tạo supplier mới
- `PUT /api/suppliers/:id` - Cập nhật supplier
- `DELETE /api/suppliers/:id` - Xóa supplier

### 5. Products
- `GET /api/products` - Lấy tất cả products
- `GET /api/products?categoryId=1` - Lấy products theo categoryId
- `GET /api/products?supplierId=1` - Lấy products theo supplierId
- `GET /api/products?status=active` - Lấy products theo status
- `GET /api/products/:id` - Lấy product theo ID
- `POST /api/products` - Tạo product mới
- `PUT /api/products/:id` - Cập nhật product
- `DELETE /api/products/:id` - Xóa product

### 6. Product Variants
- `GET /api/product-variants` - Lấy tất cả product variants
- `GET /api/product-variants?productId=1` - Lấy variants theo productId
- `GET /api/product-variants/:id` - Lấy variant theo ID
- `POST /api/product-variants` - Tạo variant mới
- `PUT /api/product-variants/:id` - Cập nhật variant
- `DELETE /api/product-variants/:id` - Xóa variant

### 7. Reviews
- `GET /api/reviews` - Lấy tất cả reviews
- `GET /api/reviews?productId=1` - Lấy reviews theo productId
- `GET /api/reviews?userId=1` - Lấy reviews theo userId
- `GET /api/reviews/:id` - Lấy review theo ID
- `POST /api/reviews` - Tạo review mới
- `PUT /api/reviews/:id` - Cập nhật review
- `DELETE /api/reviews/:id` - Xóa review

### 8. Orders
- `GET /api/orders` - Lấy tất cả orders
- `GET /api/orders?userId=1` - Lấy orders theo userId
- `GET /api/orders?status=processing` - Lấy orders theo status
- `GET /api/orders/:id` - Lấy order theo ID (bao gồm items)
- `POST /api/orders` - Tạo order mới
- `PUT /api/orders/:id` - Cập nhật order
- `DELETE /api/orders/:id` - Xóa order

### 9. Payments
- `GET /api/payments` - Lấy tất cả payments
- `GET /api/payments?orderId=1001` - Lấy payments theo orderId
- `GET /api/payments/:id` - Lấy payment theo ID
- `POST /api/payments` - Tạo payment mới
- `PUT /api/payments/:id` - Cập nhật payment
- `DELETE /api/payments/:id` - Xóa payment

### 10. Vouchers
- `GET /api/vouchers` - Lấy tất cả vouchers
- `GET /api/vouchers/:id` - Lấy voucher theo ID
- `GET /api/vouchers/code/:code` - Lấy voucher theo code
- `POST /api/vouchers` - Tạo voucher mới
- `PUT /api/vouchers/:id` - Cập nhật voucher
- `DELETE /api/vouchers/:id` - Xóa voucher

## Test API với Postman

### 1. Import Collection vào Postman

Có thể test API trực tiếp bằng cách:
1. Mở Postman
2. Tạo request mới
3. Nhập URL: `http://localhost:3000/api/{endpoint}`
4. Chọn method (GET, POST, PUT, DELETE)
5. Thêm headers: `Content-Type: application/json`
6. Thêm body (nếu cần) cho POST/PUT requests

### 2. Ví dụ Request Body

#### Tạo User mới (POST /api/users)
```json
{
  "full_name": "Nguyễn Văn C",
  "email": "nguyenvanc@example.com",
  "password": "hashed_password_789",
  "phone_number": "0923456789",
  "role": "customer"
}
```

#### Tạo Product mới (POST /api/products)
```json
{
  "name": "Cá basa",
  "description": "Cá basa tươi sống",
  "image_url": "/uploads/products/ca-basa.jpg",
  "category_id": 1,
  "supplier_id": 1,
  "status": "active"
}
```

#### Tạo Order mới (POST /api/orders)
```json
{
  "user_id": 1,
  "shipping_address": "Số 456, Đường XYZ, Quận 1, TP.HCM",
  "shipping_fee": 30000,
  "discount_amount": 50000,
  "notes": "Giao hàng buổi sáng",
  "items": [
    {
      "variant_id": 1,
      "quantity": 2
    },
    {
      "variant_id": 2,
      "quantity": 1
    }
  ]
}
```

#### Tạo Payment mới (POST /api/payments)
```json
{
  "order_id": 1001,
  "amount": 170000,
  "payment_method": "Momo",
  "transaction_id": "MOMO123456"
}
```

#### Tạo Voucher mới (POST /api/vouchers)
```json
{
  "code": "SALE20K",
  "discount_type": "fixed_amount",
  "value": 20000,
  "expiry_date": "2025-12-31T00:00:00Z",
  "usage_limit": 100
}
```

### 3. Response Format

Tất cả các API đều trả về format chuẩn:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "count": 10
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Seed Data

Ứng dụng đã được khởi tạo với seed data mẫu:
- 2 users
- 2 addresses
- 3 categories
- 1 supplier
- 2 products
- 2 product variants
- 2 reviews
- 1 order
- 2 order items
- 1 payment
- 2 vouchers

## Cấu trúc thư mục

```
Backend/
├── models/          # Models (Data layer)
│   ├── User.js
│   ├── Address.js
│   ├── Category.js
│   ├── Supplier.js
│   ├── Product.js
│   ├── ProductVariant.js
│   ├── Review.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Payment.js
│   └── Voucher.js
├── controllers/     # Controllers (Business logic)
│   ├── userController.js
│   ├── addressController.js
│   ├── categoryController.js
│   ├── supplierController.js
│   ├── productController.js
│   ├── productVariantController.js
│   ├── reviewController.js
│   ├── orderController.js
│   ├── paymentController.js
│   └── voucherController.js
├── routes/          # Routes (Routing layer)
│   ├── userRoutes.js
│   ├── addressRoutes.js
│   ├── categoryRoutes.js
│   ├── supplierRoutes.js
│   ├── productRoutes.js
│   ├── productVariantRoutes.js
│   ├── reviewRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── voucherRoutes.js
├── middleware/      # Middleware
├── server.js        # Entry point
└── package.json
```

## Lưu ý

- Backend sử dụng MongoDB (dữ liệu được lưu trữ vĩnh viễn)
- Đảm bảo MongoDB đang chạy trước khi start server
- Chạy `npm run seed` để thêm dữ liệu mẫu vào database
- Tất cả các API đều hỗ trợ CORS
- API sử dụng JSON format cho request/response

## Thiết lập MongoDB

Xem file `MONGODB_SETUP.md` để biết chi tiết cách cài đặt và cấu hình MongoDB.
