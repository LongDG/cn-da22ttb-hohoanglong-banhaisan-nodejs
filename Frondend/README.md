# Frontend MVC với React

Ứng dụng Frontend sử dụng React với kiến trúc MVC (Model-View-Controller).

## Cấu trúc thư mục

```
Frondend/
├── public/
│   └── index.html
├── src/
│   ├── models/          # Models (API Service Layer)
│   │   ├── UserModel.js
│   │   └── TodoModel.js
│   ├── views/           # Views (Presentation Components)
│   │   ├── UserView.js
│   │   ├── UserView.css
│   │   ├── TodoView.js
│   │   └── TodoView.css
│   ├── controllers/     # Controllers (Business Logic)
│   │   ├── UserController.js
│   │   └── TodoController.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000` (mặc định của React)

## Mô hình MVC trong React

### Model (Models/)
- **Chức năng**: Xử lý giao tiếp với API Backend
- **Ví dụ**: `UserModel.js`, `TodoModel.js`
- **Nhiệm vụ**: 
  - Gửi request đến Backend API
  - Xử lý response và error
  - Trả về data đã được xử lý

### View (Views/)
- **Chức năng**: Hiển thị UI, nhận props từ Controller
- **Ví dụ**: `UserView.js`, `TodoView.js`
- **Nhiệm vụ**:
  - Render UI components
  - Nhận data và callbacks từ Controller
  - Không chứa business logic

### Controller (Controllers/)
- **Chức năng**: Xử lý business logic, quản lý state
- **Ví dụ**: `UserController.js`, `TodoController.js`
- **Nhiệm vụ**:
  - Quản lý state (useState, useEffect)
  - Gọi Model để lấy/cập nhật data
  - Xử lý events và business logic
  - Truyền data và callbacks xuống View

## Luồng hoạt động

1. **User tương tác với View** → View gọi callback từ Controller
2. **Controller xử lý logic** → Gọi Model để giao tiếp với API
3. **Model gửi request** → Nhận response từ Backend
4. **Controller cập nhật state** → View tự động re-render với data mới

## API Endpoints

Frontend giao tiếp với Backend qua các endpoints:
- `GET /api/users` - Lấy tất cả users
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user
- `GET /api/todos` - Lấy tất cả todos
- `POST /api/todos` - Tạo todo mới
- `PUT /api/todos/:id` - Cập nhật todo
- `DELETE /api/todos/:id` - Xóa todo

## Cấu hình

Tạo file `.env` trong thư mục `Frondend/` để cấu hình API URL:

```
REACT_APP_API_URL=http://localhost:3000/api
```

Nếu không có file `.env`, ứng dụng sẽ sử dụng URL mặc định: `http://localhost:3000/api`

