# HẸN. — Website đặt vé sự kiện (LAB 2)

**Sinh viên:** Hồ Ngọc Quân · **MSSV:** 6651071056  
**Môn:** Thiết kế web — Bài thực hành buổi 2  
**Đường dẫn mã nguồn:** `6651071056_LAB2/`

**Website:** https://6651071056-lab2-dat-ve-su-kien.vercel.app  
**Video demo:** https://6651071056-lab2-dat-ve-su-kien.vercel.app/demo-lab2.webm  
**Báo cáo PDF:** `output/pdf/Ho_Ngoc_Quan_6651071056_LAB2.pdf`

## 1. Xác định đề tài theo MSSV

- Tổng 10 chữ số: `S = 6+6+5+1+0+7+1+0+5+6 = 37`.
- `D = S % 15 = 37 % 15 = 7`: **Website đặt vé sự kiện**.
- `F = 56 % 10 = 6`: ba tính năng bắt buộc gồm **Infinite Scroll**, **Favorites lưu localStorage** và **Dark/Light Mode lưu localStorage**.
- `C = 6 % 5 = 1`: màu chủ đạo **Emerald `#059669`**.

## 2. Tổng quan

Website **HẸN.** dùng **React 18 + TypeScript strict + Vite + Tailwind CSS + React Router v6**, bố cục dạng vé sự kiện. Có 24 sự kiện dữ liệu giả lập theo sáu chủ đề âm nhạc, nghệ thuật, workshop, ẩm thực, thể thao và cộng đồng.

Các trang:

| Tuyến | Vai trò |
| --- | --- |
| `/` | Trang chủ, tìm kiếm, lọc danh mục, cuộn tải sự kiện |
| `/item/:id` | Chi tiết sự kiện, lịch trình, đặt vé demo, thêm yêu thích |
| `/favorites` | Sự kiện đã lưu trên trình duyệt |
| `/tickets` | Vé demo đã đặt trên trình duyệt |
| `*` | Trang 404 |

### Ba tính năng được giao

1. **Infinite Scroll**: hiển thị trước 8 sự kiện; `IntersectionObserver` theo dõi sentinel cuối danh sách và hiển thị thêm tối đa 8 bản ghi mỗi lượt. Nút **Xem thêm sự kiện** là phương án thay thế; khi lọc/tìm kiếm, số lượng hiển thị đặt lại. Mã tại `src/pages/HomePage.tsx`.
2. **Favorites**: nút trái tim trên mỗi sự kiện thay đổi danh sách ID theo trạng thái React Context, đồng bộ `localStorage` khóa `hen_favorites`; trang `/favorites` hiển thị đúng dữ liệu ngay sau reload. Mã tại `src/context/AppContext.tsx`, `src/components/EventCard.tsx`.
3. **Dark/Light Mode**: nút Mặt trăng/Mặt trời ở header cập nhật `theme` và lớp `.dark` trên thẻ `<html>`, đồng bộ `localStorage` khóa `hen_theme`. Tailwind CSS sử dụng `darkMode: 'class'`. Mã tại `src/context/AppContext.tsx`, `src/components/Header.tsx`, `tailwind.config.js`.

### Chức năng mở rộng

- Tìm kiếm không dấu, lọc theo chủ đề, điều hướng bằng `Link`.
- Form đặt vé demo: nhập tên, email, số lượng; kiểm tra email, modal hỗ trợ Escape và quản lý focus, giới hạn 6 vé/lượt.
- Lưu vé demo vào `localStorage` khóa `hen_bookings`; không có xử lý thanh toán, không gửi dữ liệu lên máy chủ.
- Responsive: màn hình `<640px`: 1 cột; `640px–1023px`: 2 cột; `>=1024px`: 4 cột ở danh sách sự kiện.
- Ảnh minh họa có `alt` khi mang ý nghĩa nội dung; điều khiển dùng `aria-label`, `aria-pressed`, nhãn trường nhập và trạng thái lỗi.

## 3. Cài đặt & chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:5173` (hoặc URL Vite thông báo). Đảm bảo thiết bị có Node.js 20.19+.

## 4. Kiểm tra chất lượng

```bash
npx tsc --noEmit
npx eslint . --max-warnings 0
npm run test
npm run build
```

`src/utils.ts` cung cấp `formatCurrency`, `truncateText`, `validateEmail`, `debounce`. Bộ kiểm thử Vitest có 7 test thành công (6 test tiện ích trong `src/utils.test.ts` và 1 test bổ sung). Không dùng `any`, Redux hay thư viện quản lý state bổ sung.

Lighthouse đo trên bản build production, giả lập thiết bị di động: Performance **82**, Accessibility **96**, Best Practices **96**. Kết quả gốc tại `evidence/lighthouse-mobile.json`; các ảnh minh chứng kiểm tra được trình bày lại từ log/kết quả thật, không phải ảnh chụp trực tiếp giao diện terminal.

## 5. Cấu trúc

```text
6651071056_LAB2/
├── design/wireframe.svg       # Phác thảo giao diện
├── evidence/                   # Minh chứng kiểm thử thực tế
├── src/
│   ├── components/             # Header, Footer, EventCard, BookingModal
│   ├── context/                # React Context + localStorage
│   ├── data/events.json        # 24 sự kiện mô phỏng
│   ├── pages/                  # 5 trang giao diện
│   ├── utils.ts                # 4 hàm tiện ích
│   └── utils.test.ts           # 7 test
├── tailwind.config.js
├── vite.config.ts
├── vercel.json                 # SPA rewrite
└── README.md
```

## 6. Lưu ý học thuật

Mọi tên sự kiện, giá, lịch trình và khả năng đặt vé đều là **dữ liệu giả lập**, không đại diện một đơn vị bán vé và không phát sinh giao dịch thật. Dữ liệu tùy chọn được lưu cục bộ trên trình duyệt. Hình ảnh tham khảo từ Unsplash; nguồn ảnh cần mạng để tải.

**Quy tắc Git:** commit có dạng `[HH:MM] nội dung`, thời gian commit thực tế được Git ghi lại. Đề yêu cầu tối thiểu 14 commit trải qua tối thiểu 5 giờ; chỉ đánh giá phần này dựa trên lịch sử Git thật, không tạo mốc thời gian giả.

## 7. Video trình diễn

Video `public/demo-lab2.webm` ghi hình thao tác trực tiếp trên website đã triển khai, bao gồm cuộn tải thêm, yêu thích và lưu sau reload, chế độ giao diện lưu sau reload, chi tiết sự kiện và đặt vé demo. Video được xuất bản tại URL trong phần mở đầu.
