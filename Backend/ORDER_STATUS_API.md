# Order Status Management API

## 📋 Tổng quan

Hệ thống quản lý trạng thái đơn hàng với logic flow, tự động cập nhật thanh toán COD, và khôi phục tồn kho khi hủy.

## 🔄 Status Flow Logic

```
Chờ duyệt → Đã duyệt → Đang vận chuyển → Đã giao → Hoàn thành
     ↓           ↓              ↓
    Hủy         Hủy            Hủy
```

## 📌 API Endpoint

### Update Order Status
```
PUT /api/orders/:id/status
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "orderStatus": "Đã duyệt"
}
```

**Valid Status Values:**
- `Chờ duyệt` - Đơn hàng mới tạo (default)
- `Đã duyệt` - Admin đã xác nhận
- `Đang vận chuyển` - Đang giao hàng
- `Đã giao` - Đã giao cho khách
- `Hoàn thành` - Hoàn tất (COD: tự động cập nhật payment_status)
- `Hủy` - Đơn hàng bị hủy (tự động restore stock)

## ✨ Features

### 1. **Status Flow Validation**
Chỉ cho phép chuyển trạng thái theo flow logic:

```javascript
// ✅ Valid transitions
'Chờ duyệt' → 'Đã duyệt' hoặc 'Hủy'
'Đã duyệt' → 'Đang vận chuyển' hoặc 'Hủy'
'Đang vận chuyển' → 'Đã giao' hoặc 'Hủy'
'Đã giao' → 'Hoàn thành'

// ❌ Invalid transitions (will be rejected)
'Đã giao' → 'Chờ duyệt' // Không thể lùi lại
'Hoàn thành' → bất kỳ trạng thái nào // Không thể thay đổi
```

### 2. **Automatic Stock Restoration**
Khi đơn hàng chuyển sang `Hủy`:
- Tự động restore `stock_quantity` của tất cả ProductVariant trong đơn
- Log chi tiết trong console: `[STOCK RESTORED] Variant V001: +2`

**Example:**
```javascript
// Order items:
// - Variant V001: quantity = 2
// - Variant V002: quantity = 3

// When order is cancelled:
// V001 stock_quantity += 2
// V002 stock_quantity += 3
```

### 3. **COD Payment Auto-Complete**
Khi đơn COD chuyển sang `Hoàn thành`:
- Tự động set `payment_status = 'Đã thanh toán'`
- Cập nhật Payment record: `status = 'successful'`
- Log: `[COD PAYMENT COMPLETED] Order #123 - Payment received on delivery`

### 4. **Transaction Safety**
- Sử dụng MongoDB transaction
- Rollback nếu có lỗi
- Đảm bảo data consistency

## 🧪 Testing

### Run Full Test Suite
```bash
node test-order-status.js
```

**Test scenarios:**
- ✅ Valid status transitions
- ❌ Invalid status transitions (should fail)
- 💰 COD payment auto-complete
- 📦 Stock restoration logging

### Test Cancellation Only
```bash
node test-order-status.js --cancel
```

## 📝 Usage Examples

### Example 1: Approve Order
```bash
curl -X PUT http://localhost:5000/api/orders/123/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderStatus": "Đã duyệt"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "orderCode": "SF-A8K9M2",
    "orderStatus": "Đã duyệt",
    "payment_method": "COD",
    "payment_status": "Chưa thanh toán"
  },
  "message": "Cập nhật trạng thái đơn hàng thành công: Đã duyệt"
}
```

### Example 2: Complete COD Order
```bash
# Step 1: Mark as delivered
curl -X PUT http://localhost:5000/api/orders/123/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderStatus": "Đã giao"}'

# Step 2: Complete order (auto-update payment)
curl -X PUT http://localhost:5000/api/orders/123/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderStatus": "Hoàn thành"}'
```

**Response (Step 2):**
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "orderStatus": "Hoàn thành",
    "payment_status": "Đã thanh toán"  // ← Auto-updated for COD
  },
  "message": "Cập nhật trạng thái đơn hàng thành công: Hoàn thành"
}
```

### Example 3: Cancel Order
```bash
curl -X PUT http://localhost:5000/api/orders/123/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderStatus": "Hủy"}'
```

**Backend Console Logs:**
```
[STOCK RESTORED] Variant V001: +2
[STOCK RESTORED] Variant V002: +3
[ORDER STATUS UPDATE] Order #123: Chờ duyệt → Hủy
```

## ❌ Error Handling

### Invalid Status Transition
```json
{
  "success": false,
  "error": "Không thể chuyển từ \"Hoàn thành\" sang \"Chờ duyệt\". Trạng thái tiếp theo hợp lệ: Không có"
}
```

### Invalid Status Value
```json
{
  "success": false,
  "error": "orderStatus không hợp lệ. Các trạng thái: Chờ duyệt, Đã duyệt, Đang vận chuyển, Đã giao, Hoàn thành, Hủy"
}
```

### Order Not Found
```json
{
  "success": false,
  "error": "Không tìm thấy đơn hàng"
}
```

## 🔐 Security

- **Authentication Required**: Bearer token
- **Admin Only**: `requireAdmin` middleware
- **Transaction Safe**: Automatic rollback on errors

## 📊 Database Changes

### Order Model Updates
- `orderStatus`: String (enum with 6 values)
- `payment_status`: Auto-updated for COD at "Hoàn thành"

### ProductVariant Updates
- `stock_quantity`: Auto-restored when order cancelled

### Payment Updates
- `payment_status`: Synced with order completion
- `status`: Set to "successful" for completed COD

## 🎯 Integration with PaymentSection Component

**Frontend Flow:**
1. User selects payment method (COD/Banking) in `PaymentSection.jsx`
2. User clicks "Xác nhận đặt hàng"
3. Frontend calls `POST /api/orders` with `paymentMethod`
4. Order created with `orderStatus: 'Chờ duyệt'`
5. Admin uses `PUT /api/orders/:id/status` to update status
6. If COD and status → "Hoàn thành": payment auto-completed

**Admin Workflow:**
```
1. View order: GET /api/orders
2. Approve: PUT /api/orders/:id/status → "Đã duyệt"
3. Ship: PUT /api/orders/:id/status → "Đang vận chuyển"
4. Deliver: PUT /api/orders/:id/status → "Đã giao"
5. Complete: PUT /api/orders/:id/status → "Hoàn thành"
   (COD payment auto-marked as paid)
```

## 📚 Related Files

- **Controller**: `Backend/controllers/orderController.js`
- **Routes**: `Backend/routes/orderRoutes.js`
- **Model**: `Backend/models/Order.js`
- **Test**: `Backend/test-order-status.js`
- **Frontend**: `frontend/src/components/PaymentSection.jsx`

## 🚀 Next Steps

1. ✅ Backend API complete
2. ✅ PaymentSection component complete
3. 📝 TODO: Integrate PaymentSection into checkout page
4. 📝 TODO: Create admin order management UI
5. 📝 TODO: Add order status history tracking

## 💡 Tips

- Always test status transitions with `test-order-status.js` after changes
- Check backend console for detailed logs during development
- Use `--cancel` flag to test stock restoration
- COD orders automatically update payment on completion
- Cancelled orders automatically restore stock

---

**Created:** 2025-01-XX  
**Last Updated:** 2025-01-XX  
**Version:** 1.0.0
