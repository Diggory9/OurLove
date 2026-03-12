# OurLove - Website lưu giữ kỷ niệm cặp đôi

## Tổng quan
Website cho cặp đôi lưu giữ ảnh, timeline, thư tình, bucket list, ngày đặc biệt, nhạc nền.
Stack: **Next.js 16** (frontend) + **Express.js** (backend) + **MongoDB** + **Cloudinary** (storage).

## Kiến trúc

```
OurLove/
├── src/                    # Frontend (Next.js, port 3001)
│   ├── app/(public)/       # 11 trang public (Vietnamese URLs)
│   ├── app/admin/          # 18 trang admin CRUD
│   ├── app/api/revalidate/ # ISR revalidation endpoint
│   ├── components/         # 29 components
│   ├── lib/
│   │   ├── data.ts         # Server-side fetch (ISR 60s)
│   │   ├── admin-api.ts    # Client-side admin API (30+ functions)
│   │   └── utils.ts        # Helpers (formatDate, countdown, cn...)
│   └── types/index.ts      # TypeScript interfaces
├── backend/                # Express API (port 5001)
│   └── src/
│       ├── app.ts / server.ts
│       ├── config/         # env, db, cors, cloudinary
│       ├── models/         # 9 models (User, Album, Photo, TimelineEvent, LoveLetter, SpecialDay, BucketList, Music, SiteConfig)
│       ├── controllers/    # 11 controllers
│       ├── routes/         # 11 route files
│       ├── middleware/      # auth, requireAdmin, upload, errorHandler, rateLimit, validate
│       └── seed/           # seed.ts, seedAdmin.ts
```

## API Endpoints (prefix: /api)

| Resource | Routes | Auth |
|----------|--------|------|
| Auth | POST /auth/login, GET /auth/me | Public / JWT |
| Albums | CRUD /albums, /albums/:slug | Read public, Write admin |
| Photos | CRUD /photos, GET /photos/featured, /photos/album/:slug | Read public, Write admin |
| Timeline | CRUD /timeline, GET /timeline/latest, /timeline/:slug | Read public, Write admin |
| Love Letters | GET /love-letters (visible), GET /love-letters/admin (all), CRUD | Read public, Write admin |
| Special Days | CRUD /special-days, GET /special-days/upcoming | Read public, Write admin |
| Bucket List | CRUD /bucket-list, PATCH /bucket-list/:id/toggle | Read public, Write admin |
| Music | GET /music (active), GET /music/admin (all), CRUD | Read public, Write admin |
| Upload | POST /upload/image, /upload/images, /upload/audio | Admin only |
| Search | GET /search?q=query | Public |
| Site Config | GET/PUT /site-config | Read public, Write admin |
| Health | GET /health | Public |

## Frontend Pages

### Public (Vietnamese slug)
- `/` - Trang chủ (hero, counter, featured photos, timeline preview, upcoming days)
- `/thu-vien` - Thư viện ảnh (album grid)
- `/thu-vien/[albumSlug]` - Chi tiết album (photo grid + lightbox)
- `/dong-thoi-gian` - Dòng thời gian
- `/dong-thoi-gian/[slug]` - Chi tiết sự kiện
- `/loi-nhan` - Thư tình
- `/loi-nhan/[slug]` - Chi tiết thư
- `/ke-hoach` - Bucket list
- `/ngay-dac-biet` - Ngày đặc biệt
- `/tim-kiem` - Tìm kiếm
- `/ve-chung-toi` - Về chúng tôi

### Admin
- `/admin` - Dashboard
- `/admin/login` - Đăng nhập
- `/admin/{albums,photos,timeline,love-letters,bucket-list,special-days,music}` - Danh sách
- `/admin/{resource}/new` - Tạo mới
- `/admin/{resource}/[slug|id]` - Chỉnh sửa
- `/admin/settings` - Cài đặt site

## Deploy

| Service | URL | Ghi chú |
|---------|-----|---------|
| Frontend (Vercel) | our-love-alpha.vercel.app | Auto-deploy từ GitHub |
| Backend (Render) | ourlove-ftbl.onrender.com | Free tier, sleep sau 15 phút |
| Database (MongoDB Atlas) | cluster0.zfiqgky.mongodb.net/ourlove | |
| Storage (Cloudinary) | cloud: dohff2lyj | Image + Audio |

## Environment Variables

### Backend (Render)
MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN, NODE_ENV, PORT, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### Frontend (Vercel)
NEXT_PUBLIC_API_URL, REVALIDATE_SECRET, NEXT_PUBLIC_REVALIDATE_SECRET

## Quy ước code
- Commit message bằng tiếng Việt
- Models dùng `unique: true` trên slug (tự tạo index, không cần thêm `schema.index()`)
- Upload qua Cloudinary (image max 5MB, audio max 20MB)
- ISR revalidate 60s cho public pages, manual revalidate qua /api/revalidate khi admin thay đổi data
- CORS cho phép tất cả *.vercel.app
- Rate limiting: 10 auth/15min, 100 API/min, 20 uploads/min

## Vấn đề đã biết
- Music Player chỉ hỗ trợ file upload MP3, không hỗ trợ YouTube URL (audio tag limitation)
- Admin Music form hiện cho nhập URL text, nên đổi sang upload file MP3
- Site metadata có `robots: { index: false }` trong layout.tsx - bỏ nếu muốn SEO
- Render free tier sleep sau 15 phút không hoạt động → cold start chậm
