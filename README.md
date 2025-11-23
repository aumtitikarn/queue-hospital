# ระบบคิวโรงพยาบาล

ระบบจัดการคิวโรงพยาบาลที่สร้างด้วย Next.js, Prisma, Zustand, และ TanStack Query

## เทคโนโลยีที่ใช้

- **Next.js 16** (App Router) - Framework สำหรับ React
- **Prisma ORM** - ORM สำหรับจัดการฐานข้อมูล
- **TanStack Query** - สำหรับจัดการ server state และ data fetching
- **Zustand** - สำหรับจัดการ client state
- **TypeScript** - Type safety
- **Tailwind CSS** - สำหรับ styling
- **SQLite** - ฐานข้อมูล

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. สร้าง Prisma client:
```bash
npx prisma generate
```

3. รัน migration:
```bash
npx prisma migrate dev
```

4. เริ่ม development server:
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## การใช้งาน Docker

### Build Docker Image
```bash
docker build -t queue-hospital .
```

### Run with Docker
```bash
docker run -p 3000:3000 -v $(pwd)/data:/app/data queue-hospital
```

### หรือใช้ Docker Compose
```bash
docker-compose up -d
```

Docker Compose จะสร้าง volume สำหรับเก็บข้อมูล database ที่ `./data` directory

## ฟีเจอร์

### จัดการแผนก (Departments)
- ดูรายการแผนกทั้งหมด (`/admin/departments`)
- เพิ่มแผนกใหม่ (`/admin/departments/new`)
- แก้ไขข้อมูลแผนก (`/admin/departments/[id]/edit`)
- ลบแผนก

### กดบัตรคิว (Queue)
- ผู้ป่วยสามารถกดบัตรคิวได้ที่หน้าแรก (`/`)
- เลือกแผนกที่ต้องการ
- กรอกชื่อผู้ป่วยและเบอร์โทรศัพท์ (ไม่บังคับ)
- ระบบจะสร้างหมายเลขคิวอัตโนมัติตามลำดับ
- สร้างสลิปพร้อม QR Code สำหรับสแกนดูสถานะคิว

### ดูสถานะคิว
- สแกน QR Code จากสลิปเพื่อดูสถานะคิว
- แสดงจำนวนคิวที่เหลือ
- แสดงเวลารอโดยประมาณ
- อัปเดตอัตโนมัติทุก 10 วินาที

## โครงสร้างโปรเจกต์

```
├── app/
│   ├── api/
│   │   ├── departments/     # API routes สำหรับแผนก
│   │   └── queue/           # API routes สำหรับคิว
│   ├── admin/               # หน้าจัดการ (Admin Panel)
│   │   ├── departments/    # จัดการแผนก
│   │   └── layout.tsx       # Admin layout with sidebar
│   ├── [id]/                # หน้าสถานะคิว
│   └── page.tsx             # หน้ากดบัตรคิว (หน้าแรก)
├── hooks/                   # Custom hooks สำหรับ TanStack Query
├── lib/
│   └── prisma.ts            # Prisma client instance
└── prisma/
    └── schema.prisma        # Database schema
```

## Database Schema

### Department
- `id`: String (CUID)
- `name`: String
- `description`: String? (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### QueueTicket
- `id`: String (CUID)
- `queueNumber`: Int
- `patientName`: String
- `phoneNumber`: String? (optional)
- `departmentId`: String
- `status`: String (waiting, serving, completed, cancelled)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Routes

### Departments
- `GET /api/departments` - ดึงรายการแผนกทั้งหมด
- `POST /api/departments` - สร้างแผนกใหม่
- `GET /api/departments/[id]` - ดึงข้อมูลแผนก
- `PUT /api/departments/[id]` - อัปเดตแผนก
- `DELETE /api/departments/[id]` - ลบแผนก

### Queue
- `GET /api/queue` - ดึงรายการคิวทั้งหมด (รองรับ query params: departmentId, status)
- `POST /api/queue` - สร้างบัตรคิวใหม่
- `GET /api/queue/[id]` - ดึงข้อมูลบัตรคิว
- `PUT /api/queue/[id]` - อัปเดตสถานะบัตรคิว
- `GET /api/queue/[id]/status` - ดึงสถานะคิว (จำนวนคิวที่เหลือ, เวลารอ)

## การใช้งาน

1. **จัดการแผนก**: ไปที่ `/admin` เพื่อเข้าสู่ระบบจัดการ
   - ใช้ sidebar เพื่อไปที่ "จัดการแผนก"
   - เพิ่ม แก้ไข หรือลบแผนก

2. **กดบัตรคิว**: ไปที่ `/` (หน้าแรก) เพื่อกดบัตรคิว
   - เลือกแผนกและกรอกข้อมูลผู้ป่วย
   - รับสลิปพร้อม QR Code

3. **ดูสถานะคิว**: สแกน QR Code จากสลิป
   - ดูจำนวนคิวที่เหลือ
   - ดูเวลารอโดยประมาณ

## Environment Variables

สร้างไฟล์ `.env` ใน root directory:

```env
DATABASE_URL="file:./dev.db"
```

## หมายเหตุ

- โปรเจกต์นี้ใช้ Prisma 7 ซึ่งต้องการ adapter สำหรับการเชื่อมต่อฐานข้อมูล
- ใช้ `@prisma/adapter-better-sqlite3` สำหรับ SQLite
- ฐานข้อมูล SQLite จะถูกสร้างที่ `./dev.db` (หรือตามที่กำหนดใน `DATABASE_URL`)
- สำหรับ Docker, database จะถูกเก็บไว้ใน volume ที่ `./data` directory

## License

MIT
# queue-hospital
