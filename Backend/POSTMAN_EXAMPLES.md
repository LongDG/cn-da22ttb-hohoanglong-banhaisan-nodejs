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
```

### POST - Tạo user mới
```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "full_name": "Nguyễn Văn C",
  "email": "nguyenvanc@example.com",
  "password": "hashed_password_789",
  "phone_number": "0923456789",
  "role": "customer"
}
```

### PUT - Cập nhật user
```
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A Updated",
  "email": "nguyenvana@example.com",
  "phone_number": "0909123456"
}
```

### DELETE - Xóa user
```
DELETE http://localhost:3000/api/users/1
```

## 2. Addresses API

### GET - Lấy tất cả addresses
```
GET http://localhost:3000/api/addresses
```

### GET - Lấy addresses theo userId
```
GET http://localhost:3000/api/addresses?userId=1
```

### POST - Tạo address mới
```
POST http://localhost:3000/api/addresses
Content-Type: application/json

{
  "user_id": 1,
  "recipient_name": "Nguyễn Văn A",
  "phone_number": "0909123456",
  "full_address": "Số 789, Đường DEF, Quận 3, TP.HCM",
  "is_default": false
}
```

## 3. Categories API

### GET - Lấy tất cả categories
```
GET http://localhost:3000/api/categories
```

### POST - Tạo category mới
```
POST http://localhost:3000/api/categories
Content-Type: application/json

{
  "name": "Cua",
  "parent_id": null
}
```

### POST - Tạo sub-category
```
POST http://localhost:3000/api/categories
Content-Type: application/json

{
  "name": "Cá biển",
  "parent_id": 1
}
```

## 4. Suppliers API

### GET - Lấy tất cả suppliers
```
GET http://localhost:3000/api/suppliers
```

### POST - Tạo supplier mới
```
POST http://localhost:3000/api/suppliers
Content-Type: application/json

{
  "name": "Nhà cung cấp Hải sản Sài Gòn",
  "contact_info": "ĐC: 456 Nguyễn Huệ, Q1, TP.HCM - ĐT: 028-9999999"
}
```

## 5. Products API

### GET - Lấy tất cả products
```
GET http://localhost:3000/api/products
```

### GET - Lấy products theo category
```
GET http://localhost:3000/api/products?categoryId=2
```

### GET - Lấy products theo status
```
GET http://localhost:3000/api/products?status=active
```

### POST - Tạo product mới
```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Cá basa",
  "description": "Cá basa tươi sống, đóng gói sẵn",
  "image_url": "/uploads/products/ca-basa.jpg",
  "category_id": 1,
  "supplier_id": 1,
  "status": "active"
}
```

## 6. Product Variants API

### GET - Lấy tất cả variants
```
GET http://localhost:3000/api/product-variants
```

### GET - Lấy variants theo productId
```
GET http://localhost:3000/api/product-variants?productId=1
```

### POST - Tạo variant mới
```
POST http://localhost:3000/api/product-variants
Content-Type: application/json

{
  "product_id": 1,
  "name": "Khay 1kg",
  "price": 240000,
  "sale_price": 220000,
  "stock_quantity": 15
}
```

## 7. Reviews API

### GET - Lấy tất cả reviews
```
GET http://localhost:3000/api/reviews
```

### GET - Lấy reviews theo productId
```
GET http://localhost:3000/api/reviews?productId=1
```

### POST - Tạo review mới
```
POST http://localhost:3000/api/reviews
Content-Type: application/json

{
  "product_id": 1,
  "user_id": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt, sẽ mua lại!"
}
```

## 8. Orders API

### GET - Lấy tất cả orders
```
GET http://localhost:3000/api/orders
```

### GET - Lấy order theo ID (bao gồm items)
```
GET http://localhost:3000/api/orders/1001
```

### POST - Tạo order mới
```
POST http://localhost:3000/api/orders
Content-Type: application/json

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

### PUT - Cập nhật order status
```
PUT http://localhost:3000/api/orders/1001
Content-Type: application/json

{
  "status": "completed"
}
```

## 9. Payments API

### GET - Lấy tất cả payments
```
GET http://localhost:3000/api/payments
```

### GET - Lấy payments theo orderId
```
GET http://localhost:3000/api/payments?orderId=1001
```

### POST - Tạo payment mới
```
POST http://localhost:3000/api/payments
Content-Type: application/json

{
  "order_id": 1001,
  "amount": 170000,
  "payment_method": "Momo",
  "transaction_id": "MOMO123456"
}
```

### PUT - Cập nhật payment status
```
PUT http://localhost:3000/api/payments/501
Content-Type: application/json

{
  "status": "successful",
  "transaction_id": "MOMO123456"
}
```

## 10. Vouchers API

### GET - Lấy tất cả vouchers
```
GET http://localhost:3000/api/vouchers
`

### GET - Lấy voucher theo code
```
GET http://localhost:3000/api/vouchers/code/SALE50K
```

### POST - Tạo voucher mới
```
POST http://localhost:3000/api/vouchers
Content-Type: application/json

{
  "code": "SALE20K",
  "discount_type": "fixed_amount",
  "value": 20000,
  "expiry_date": "2025-12-31T00:00:00Z",
  "usage_limit": 100
}
```

### POST - Tạo voucher phần trăm
```
POST http://localhost:3000/api/vouchers
Content-Type: application/json

{
  "code": "SALE15P",
  "discount_type": "percentage",
  "value": 15,
  "expiry_date": "2025-12-25T00:00:00Z",
  "usage_limit": 50
}
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "full_name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "role": "customer"
  },
  "message": "User created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "User not found"
}
```

## Test Flow Example

1. **Tạo User mới**
   ```
   POST /api/users
   ```

2. **Tạo Address cho User**
   ```
   POST /api/addresses
   ```

3. **Tạo Product mới**
   ```
   POST /api/products
   ```

4. **Tạo Product Variant**
   ```
   POST /api/product-variants
   ```

5. **Tạo Order**
   ```
   POST /api/orders
   ```

6. **Tạo Payment cho Order**
   ```
   POST /api/payments
   ```

7. **Cập nhật Payment status**
   ```
   PUT /api/payments/:id
   ```

8. **Tạo Review cho Product**
   ```
   POST /api/reviews
   ```

## Lưu ý khi test

- Đảm bảo server đang chạy tại `http://localhost:3000`
- Sử dụng đúng Content-Type header: `application/json`
- Kiểm tra response status code:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 404: Not Found
  - 500: Internal Server Error
- Dữ liệu seed đã được khởi tạo sẵn, có thể test ngay với các ID có sẵn

