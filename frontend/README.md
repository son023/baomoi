# Frontend Tâm Lý - ReactJS

Ứng dụng frontend ReactJS cho trang web tâm lý với giao diện giống Baomoi.

## 🚀 Tính năng

- **Header giống Baomoi** với search bar và navigation
- **Layout trang chủ** với bài featured lớn và sidebar
- **Phân loại theo chủ đề**: Trầm cảm, Stress, Rối loạn lo âu
- **Responsive design** cho mọi thiết bị
- **Routing** với React Router
- **Styled Components** cho CSS-in-JS

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   └── Header.js          # Header với navigation
├── pages/
│   ├── HomePage.js        # Trang chủ
│   ├── CategoryPage.js    # Trang danh mục
│   └── ArticlePage.js     # Trang chi tiết bài viết
├── services/
│   └── api.js            # API service và mock data
├── App.js                # Main app component
└── App.css               # Global styles
```

## 🛠 Cài đặt và chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm start
   ```

3. **Mở trình duyệt:**
   - Ứng dụng sẽ chạy tại: `http://localhost:3001`

## 📱 Các trang

### Trang chủ (/)
- Bài viết featured với hình lớn
- Sidebar với các bài mới nhất
- Sections theo chủ đề (4+4 bài mỗi section)

### Trang danh mục (/category/:categoryName)
- `/category/tram-cam` - Bài viết về trầm cảm
- `/category/stress` - Bài viết về stress
- `/category/roi-loan-lo-au` - Bài viết về rối loạn lo âu

### Trang chi tiết (/article/:id)
- Nội dung đầy đủ của bài viết
- Bài viết liên quan

## 🎨 Thiết kế

- **Color scheme**: Gradient tím-xanh (#667eea, #764ba2)
- **Typography**: Segoe UI, sans-serif
- **Layout**: CSS Grid và Flexbox
- **Animations**: Smooth hover effects

## 🔧 Công nghệ sử dụng

- **React 18** - UI Library
- **React Router Dom** - Routing
- **Styled Components** - CSS-in-JS
- **Axios** - HTTP Client
- **Mock Data** - Dữ liệu mẫu cho development

## 📊 Dữ liệu

Hiện tại sử dụng mock data với:
- 16 bài viết mẫu
- 5 categories
- Hình ảnh từ Unsplash
- Metadata đầy đủ

## 🔗 Kết nối Backend

Để kết nối với Rails backend:

1. Cập nhật `API_BASE_URL` trong `src/services/api.js`
2. Thay thế mock data bằng API calls thực
3. Xử lý authentication nếu cần

## 📝 Scripts

- `npm start` - Chạy development server
- `npm build` - Build production
- `npm test` - Chạy tests
- `npm eject` - Eject từ Create React App

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License
