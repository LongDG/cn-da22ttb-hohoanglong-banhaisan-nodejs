# Ứng dụng MVC - Backend Node.js & Frontend React

Dự án mẫu thể hiện kiến trúc MVC (Model-View-Controller) với Backend Node.js/Express và Frontend React.

## Cấu trúc dự án

```
ChuyenNganh/
├── Backend/          # Backend Node.js/Express (MVC)
│   ├── models/       # Models (Data layer)
│   ├── controllers/  # Controllers (Business logic)
│   ├── routes/       # Routes (Routing layer)
│   ├── middleware/   # Middleware
│   └── server.js     # Entry point
│
└── Frondend/         # Frontend React (MVC)
    ├── src/
    │   ├── models/       # Models (API Service layer)
    │   ├── views/        # Views (Presentation components)
    │   ├── controllers/  # Controllers (Business logic)
    │   └── App.js
    └── public/
```

## Kiến trúc MVC

### Backend (Node.js/Express)

#### Model
- **Vị trí**: `Backend/models/`
- **Chức năng**: Định nghĩa cấu trúc dữ liệu và logic truy cập dữ liệu
- **Ví dụ**: `User.js`, `Todo.js`
- **Nhiệm vụ**:
  - Định nghĩa schema/model
  - Xử lý CRUD operations
  - Quản lý repository pattern

#### Controller
- **Vị trí**: `Backend/controllers/`
- **Chức năng**: Xử lý business logic và giao tiếp với Model
- **Ví dụ**: `userController.js`, `todoController.js`
- **Nhiệm vụ**:
  - Xử lý request từ Routes
  - Gọi Model để lấy/cập nhật data
  - Xử lý validation
  - Trả về response

#### Route (View trong MVC API)
- **Vị trí**: `Backend/routes/`
- **Chức năng**: Định nghĩa endpoints và kết nối với Controllers
- **Ví dụ**: `userRoutes.js`, `todoRoutes.js`
- **Nhiệm vụ**:
  - Định nghĩa HTTP routes
  - Kết nối routes với controllers
  - Áp dụng middleware

### Frontend (React)

#### Model
- **Vị trí**: `Frondend/src/models/`
- **Chức năng**: Xử lý giao tiếp với API Backend
- **Ví dụ**: `UserModel.js`, `TodoModel.js`
- **Nhiệm vụ**:
  - Gửi HTTP requests đến Backend
  - Xử lý response và error
  - Trả về data đã được xử lý

#### View
- **Vị trí**: `Frondend/src/views/`
- **Chức năng**: Hiển thị UI, nhận props từ Controller
- **Ví dụ**: `UserView.js`, `TodoView.js`
- **Nhiệm vụ**:
  - Render UI components
  - Nhận data và callbacks từ Controller
  - Không chứa business logic

#### Controller
- **Vị trí**: `Frondend/src/controllers/`
- **Chức năng**: Xử lý business logic, quản lý state
- **Ví dụ**: `UserController.js`, `TodoController.js`
- **Nhiệm vụ**:
  - Quản lý state (useState, useEffect)
  - Gọi Model để lấy/cập nhật data
  - Xử lý events và business logic
  - Truyền data và callbacks xuống View

## Cài đặt và chạy

### Backend

```bash
cd Backend
npm install
npm start
# hoặc
npm run dev  # với nodemon
```

Backend sẽ chạy tại `http://localhost:3000`

### Frontend

```bash
cd Frondend
npm install
npm start
```

Frontend sẽ chạy tại `http://localhost:3001` (hoặc port khác nếu 3001 đã được sử dụng)

## API Endpoints

### Users
- `GET /api/users` - Lấy tất cả users
- `GET /api/users/:id` - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Todos
- `GET /api/todos` - Lấy tất cả todos
- `GET /api/todos?userId=1` - Lấy todos theo userId
- `GET /api/todos/:id` - Lấy todo theo ID
- `POST /api/todos` - Tạo todo mới
- `PUT /api/todos/:id` - Cập nhật todo
- `DELETE /api/todos/:id` - Xóa todo

## Luồng hoạt động

### Backend
1. **Request** → Route nhận request
2. **Route** → Gọi Controller tương ứng
3. **Controller** → Xử lý logic, gọi Model
4. **Model** → Truy cập/cập nhật data
5. **Response** → Controller trả về response

### Frontend
1. **User tương tác** → View gọi callback từ Controller
2. **Controller** → Xử lý logic, gọi Model
3. **Model** → Gửi request đến Backend API
4. **Backend** → Xử lý và trả về response
5. **Controller** → Cập nhật state
6. **View** → Tự động re-render với data mới

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- Body-parser
- CORS
- Dotenv

### Frontend
- React 18
- Axios
- CSS3

## Tính năng

- ✅ CRUD đầy đủ cho Users
- ✅ CRUD đầy đủ cho Todos
- ✅ Validation cơ bản
- ✅ Error handling
- ✅ Responsive design
- ✅ Kiến trúc MVC rõ ràng

## Ghi chú

- Backend sử dụng in-memory database (có thể thay thế bằng MongoDB, PostgreSQL, ...)
- Frontend có thể cấu hình API URL qua file `.env`
- Cả Backend và Frontend đều tuân theo nguyên tắc MVC

## Tác giả

Hồ Hoàng Long 
Liên hệ: 0383277120
Email: longho.28112003@gmail.com

