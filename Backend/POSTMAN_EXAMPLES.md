# Hướng dẫn Test API với Postman

## Cấu hình cơ bản

1. **Base URL**: `http://localhost:3000/api`
2. **Headers**: 
   - `Content-Type: application/json`

## 1. Users API

### GET - Lấy tất cả users
```
GET http://localhost:3000/api/users
```

### GET - Lấy user theo ID
```
GET http://localhost:3000/api/users/1
# Hướng dẫn Test API với Postman (cập nhật)

**Base URL:** `http://localhost:3000/api`

**Headers chung:**
- `Content-Type: application/json`

Lưu ý: hiện backend đang kết nối đến database `BIENTUOI_DB`. Dữ liệu mẫu có sẵn (số lượng hiện tại):
- `Users`: 3
- `Addresses`: 2
- `Categories`: 5
- `Products`: 3
- `Product_Variants`: 6
- `Suppliers`: 3
- `Orders`: 2
- `Order_Items`: 2
- `Payments`: 2
- `Vouchers`: 2

----

## 1. Users

- GET tất cả users
```
GET /users
```

- GET user theo `user_id`
```
GET /users/:id          # ví dụ: /users/1
```

- POST tạo user
```
POST /users
Body (JSON):
{
  "full_name": "Nguyễn Văn C",
  "email": "nguyenvanc@example.com",
  "password": "your_password_here",
  "phone_number": "0923456789",
  "role": "customer"
}
```

- PUT cập nhật user
```
PUT /users/:id
Body (JSON): { ...fields cần cập nhật... }
```

- DELETE user
```
DELETE /users/:id
```

----

## 2. Addresses

- GET tất cả addresses (hoặc lọc theo userId)
```
GET /addresses
GET /addresses?userId=1
```

- GET address theo `address_id`
```
GET /addresses/:id
```

- POST tạo address
```
POST /addresses
Body (JSON):
{
  "user_id": 1,
  "recipient_name": "Nguyễn Văn A",
  "phone_number": "0909123456",
  "full_address": "Số 789, Đường DEF, Quận 3, TP.HCM",
  "is_default": false
}
```

- PUT cập nhật address
```
PUT /addresses/:id
```

- DELETE address
```
DELETE /addresses/:id
```

----

## 3. Categories

- GET tất cả categories
```
GET /categories
```

- POST tạo category (parent_id null nếu root)
```
POST /categories
Body (JSON): { "name": "Cua", "parent_id": null }
```

----

## 4. Suppliers

- GET tất cả suppliers
```
GET /suppliers
```

- POST tạo supplier
```
POST /suppliers
Body (JSON): { "name": "Nhà cung cấp X", "contact_info": "..." }
```

----

## 5. Products

- GET tất cả products (hỗ trợ query: `categoryId`, `status`)
```
GET /products
GET /products?categoryId=10
GET /products?status=active
```

- POST tạo product
```
POST /products
Body (JSON): { "name":"Cá basa","description":"...","image_url":"/...","category_id":10,"supplier_id":501,"status":"active" }
```

----

## 6. Product Variants

- GET tất cả variants (hoặc lọc theo productId)
```
GET /product-variants
GET /product-variants?productId=1001
```

- POST tạo variant
```
POST /product-variants
Body (JSON): { "product_id": 1001, "name": "Size 1kg", "price": 450000, "sale_price": null, "stock_quantity": 50 }
```

----

## 7. Reviews

- GET tất cả reviews (hoặc lọc theo productId)
```
GET /reviews
GET /reviews?productId=1001
```

- POST tạo review
```
POST /reviews
Body (JSON): { "product_id":1001, "user_id":1, "rating":5, "comment":"Tốt" }
```

----

## 8. Orders

- GET tất cả orders
```
GET /orders
```

- GET order theo ID (bao gồm items)
```
GET /orders/:id
```

- POST tạo order (kèm `items`)
```
POST /orders
Body (JSON): {
  "user_id":1,
  "shipping_address":"...",
  "shipping_fee":30000,
  "discount_amount":0,
  "notes":"...",
  "items":[ {"variant_id":2,"quantity":2} ]
}
```

----

## 9. Payments

- GET tất cả payments
```
GET /payments
```

- GET payments theo `orderId`
```
GET /payments?orderId=9001
```

- POST tạo payment
```
POST /payments
Body (JSON): { "order_id":9001, "amount":1335000, "payment_method":"COD", "transaction_id":null }
```

----

## 10. Vouchers

- GET tất cả vouchers
```
GET /vouchers
```

- GET voucher theo code
```
GET /vouchers/code/:code
```

- POST tạo voucher
```
POST /vouchers
Body (JSON): { "code":"SALE20K", "discount_type":"fixed_amount", "value":20000, "expiry_date":"2025-12-31T00:00:00Z" }
```

----

## 11. Order Items

- GET tất cả order-items
```
GET /order-items
```

----

## Ví dụ response thành công

```json
{
  "success": true,
  "data": [ ... ],
  "count": 3
}
```

## Ghi chú khi test

- Đảm bảo server đang chạy: `node server.js` trong `Backend` và `Base URL` đúng.
- Nếu response trả `[]` (mảng rỗng), kiểm tra `MONGODB_URI` và tên collection (hiện backend đã map các model tới collection trong DB `BIENTUOI_DB`).
- Tránh chạy `seedData.js` nếu bạn muốn giữ dữ liệu hiện có (seed sẽ xóa và ghi lại dữ liệu).

----

Nếu bạn muốn, tôi có thể:
- Cập nhật thêm ví dụ response mẫu cho từng endpoint.
- Export một Postman collection (JSON) để import vào Postman.
```

