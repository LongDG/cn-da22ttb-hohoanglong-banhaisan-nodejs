# 🧪 Hướng dẫn test đăng nhập

## 📋 File test

File `test-login.js` sẽ test đăng nhập với các tài khoản đã seed sẵn.

## 🚀 Cách chạy test

### Bước 1: Đảm bảo server đang chạy

```bash
npm run start:memory
```

### Bước 2: Seed dữ liệu (nếu chưa seed)

Gửi POST request đến:
```
http://localhost:3000/api/seed
```

Hoặc dùng PowerShell:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
```

### Bước 3: Chạy test

Mở PowerShell/Command Prompt mới (giữ server đang chạy):

```bash
npm run test-login
```

## ✅ Các test sẽ chạy

1. **Test đăng nhập Admin**
   - Email: `admin@test.com`
   - Password: `admin123`

2. **Test đăng nhập Customer 1**
   - Email: `customer@test.com`
   - Password: `123456`

3. **Test đăng nhập Customer 2**
   - Email: `cuong@test.com`
   - Password: `123456`

4. **Test đăng nhập Customer 3**
   - Email: `dung@test.com`
   - Password: `123456`

5. **Test đăng nhập với password sai** (nên fail)
   - Email: `admin@test.com`
   - Password: `wrongpassword`

6. **Test đăng nhập với user không tồn tại** (nên fail)
   - Email: `notexist@test.com`
   - Password: `123456`

## 📊 Kết quả mong đợi

```
═══════════════════════════════════════════════════
🔐 TESTING LOGIN FUNCTIONALITY
═══════════════════════════════════════════════════

🧪 Testing login for: Admin
   Email: admin@test.com
   ✅ Login SUCCESS!
   - User ID: 2
   - Full Name: Trần Thị Bình
   - Role: admin ✓
   - Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

...

═══════════════════════════════════════════════════
📊 TEST SUMMARY
═══════════════════════════════════════════════════
✅ Passed: 6
❌ Failed: 0
📝 Total:  6
═══════════════════════════════════════════════════

🎉 All tests passed!
```

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to server"

**Nguyên nhân:** Server chưa chạy

**Giải pháp:**
```bash
npm run start:memory
```

### Lỗi: "Email hoặc mật khẩu không đúng"

**Nguyên nhân:** Dữ liệu chưa được seed

**Giải pháp:**
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"
```

### Lỗi: "Cannot find module 'axios'"

**Giải pháp:**
```bash
npm install axios
```

## 💡 Lưu ý

- Test cần server đang chạy
- Test cần dữ liệu đã được seed
- Test sẽ kiểm tra cả trường hợp thành công và thất bại

