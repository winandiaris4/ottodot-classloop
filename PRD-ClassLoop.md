# Product Requirements Document (PRD)
## ClassLoop — Edtech Class Management Platform
### Portfolio Project · Dibuat untuk melamar posisi Full Stack Engineer di Ottodot

---

**Versi:** 1.0  
**Tanggal:** September 2026  
**Status:** Draft — Ready to Build  
**Penulis:** \[Nama kamu\]

---

## Daftar Isi

1. [Latar Belakang & Tujuan](#1-latar-belakang--tujuan)
2. [Ruang Lingkup](#2-ruang-lingkup)
3. [User Personas](#3-user-personas)
4. [Arsitektur & Stack](#4-arsitektur--stack)
5. [Sistem Autentikasi & Permissions](#5-sistem-autentikasi--permissions)
6. [Modul Student](#6-modul-student)
7. [Modul Parent](#7-modul-parent)
8. [Modul Teacher](#8-modul-teacher)
9. [Modul Admin](#9-modul-admin)
10. [Self-Serve Enrollment & Payment](#10-self-serve-enrollment--payment)
11. [Database Schema](#11-database-schema)
12. [Row Level Security (RLS) Policies](#12-row-level-security-rls-policies)
13. [API Design](#13-api-design)
14. [Non-Functional Requirements](#14-non-functional-requirements)
15. [Error Handling & Validasi](#15-error-handling--validasi)
16. [Deployment & DevOps](#16-deployment--devops)
17. [Milestones & Timeline](#17-milestones--timeline)
18. [Out of Scope](#18-out-of-scope)
19. [Success Metrics](#19-success-metrics)
20. [Known Trade-offs & Keputusan Teknis](#20-known-trade-offs--keputusan-teknis)

---

## 1. Latar Belakang & Tujuan

### Konteks

ClassLoop adalah portfolio project yang dirancang khusus untuk mensimulasikan tantangan teknis yang dihadapi oleh Ottodot — sebuah edtech startup yang membangun platform live class dan game-based learning untuk anak-anak.

Proyek ini bukan generic CRUD app. Setiap keputusan arsitektur, database, dan fitur didasarkan pada kebutuhan nyata sebuah platform edtech multi-role: student, parent, teacher, dan admin yang masing-masing memiliki workflow, data access, dan tampilan berbeda.

### Tujuan Bisnis (Simulasi)

- Membantu teacher mengelola kelas, homework, dan feedback secara efisien
- Memberi parent visibilitas real-time terhadap progress akademik anak
- Memungkinkan student mengakses homework, jadwal, dan riwayat belajar
- Memberi admin kontrol penuh atas enrollment, user, dan operasional kelas
- Menyediakan self-serve enrollment agar user bisa daftar dan bayar secara mandiri

### Tujuan Portfolio

- Mendemonstrasikan kemampuan full-stack end-to-end di stack yang identik dengan Ottodot (Next.js, Supabase, Vercel)
- Menunjukkan pemahaman mendalam terhadap multi-role auth dan Row Level Security
- Membuktikan kemampuan membuat sistem production-grade: validasi, error handling, migrasi database, dan keamanan data antar role

---

## 2. Ruang Lingkup

### In Scope

| Area | Detail |
|---|---|
| Auth & Roles | 4 role: student, parent, teacher, admin |
| Student Module | Dashboard, homework list, submission, progress |
| Parent Module | Dashboard, progress anak, jadwal, notifikasi |
| Teacher Module | Kelola kelas, buat homework, review submission, feedback |
| Admin Module | Manajemen user, enrollment, laporan |
| Enrollment | Landing page + Stripe payment + auto-provisioning akun |
| Notifikasi | In-app + email (Resend) |
| Database | Supabase Postgres dengan RLS per role |

### Out of Scope (v1)

- Video conference / live class integration
- Mobile app native
- Multi-language support
- AI-based feedback atau grading otomatis
- Gamifikasi (badge, leaderboard)
- Roblox game integration

---

## 3. User Personas

### 3.1 Student — Anak usia 8–15 tahun

**Goals:**
- Melihat homework yang harus dikerjakan
- Submit jawaban homework
- Melihat nilai dan feedback dari teacher
- Melihat jadwal kelas berikutnya

**Pain Points (simulasi):**
- Lupa deadline homework
- Tidak tahu apakah sudah ada feedback dari teacher
- Bingung kelas mana yang akan berlangsung hari ini

**Key Actions:**
- View homework list (pending / submitted / graded)
- Submit homework (text atau upload file)
- View grade & feedback per homework
- View class schedule

---

### 3.2 Parent — Orang tua / wali

**Goals:**
- Memantau progress akademik anak tanpa harus tanya langsung ke anak
- Mengetahui apakah anak mengerjakan homework tepat waktu
- Melihat feedback teacher terhadap anak
- Mendapat notifikasi jika ada kelas atau deadline penting

**Pain Points:**
- Tidak tahu apakah anak benar-benar belajar
- Tidak ada visibilitas terhadap nilai dan perkembangan
- Harus menghubungi teacher secara manual untuk update

**Key Actions:**
- View children's homework completion rate
- View children's grades over time (grafik)
- View upcoming class schedule
- Receive email/in-app notification untuk deadline & nilai baru

---

### 3.3 Teacher — Guru / instruktur

**Goals:**
- Membuat dan mengelola kelas
- Membuat homework dan assign ke kelas tertentu
- Mereview submission student dan memberi nilai + feedback
- Memonitor engagement dan completion rate class

**Pain Points:**
- Susah melacak siapa yang sudah dan belum submit
- Harus buka banyak tempat untuk review homework
- Tidak ada cara sistematis untuk beri feedback per student

**Key Actions:**
- Create & manage classes (CRUD)
- Create homework (title, description, due date, max score)
- View submissions per homework
- Grade submission + tulis feedback
- View class roster dan status homework tiap student

---

### 3.4 Admin — Operator / tim Ottodot

**Goals:**
- Mengelola seluruh user (buat, nonaktifkan, ubah role)
- Mengaitkan parent ke student
- Monitor status enrollment dan pembayaran
- Melihat laporan operasional kelas

**Key Actions:**
- User management (list, create, deactivate, change role)
- Link parent to student
- View enrollment & payment history
- View operational reports (active classes, completion rates)

---

## 4. Arsitektur & Stack

### Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API routes dalam satu project, sama dengan Ottodot |
| Language | TypeScript (strict mode) | Type safety, lebih maintainable |
| Styling | Tailwind CSS | Utility-first, cepat prototyping |
| Database | Supabase (Postgres) | Auth bawaan, RLS, realtime, sama dengan Ottodot |
| ORM/Query | Supabase JS Client | Type-safe dengan generated types |
| Auth | Supabase Auth | Session management, JWT, invite link |
| File Storage | Supabase Storage | Upload homework attachment |
| Payment | Stripe (test mode) | Self-serve enrollment |
| Email | Resend | Transactional email: notifikasi, invite |
| Validation | Zod | Schema validation di server & client |
| Deploy | Vercel | Edge functions, preview deployments |

### Arsitektur Aplikasi

```
Browser
  │
  ▼
Next.js App Router (Vercel)
  ├── /app/(auth)          → Login, Register, Invite flow
  ├── /app/(student)       → Protected: role=student
  ├── /app/(parent)        → Protected: role=parent
  ├── /app/(teacher)       → Protected: role=teacher
  ├── /app/(admin)         → Protected: role=admin
  ├── /app/(public)        → Landing page, pricing, enrollment
  └── /app/api/            → Route handlers (webhooks, server actions)
  │
  ▼
Supabase (Backend as a Service)
  ├── Auth                 → User session, JWT, invite tokens
  ├── Postgres             → Data utama dengan RLS
  └── Storage              → File upload (homework attachments)
  │
  ▼
External Services
  ├── Stripe               → Payment processing
  └── Resend               → Email transactional
```

### Folder Structure

```
/app
  /(auth)
    login/
    register/
    invite/[token]/
  /(student)
    dashboard/
    homework/
    homework/[id]/
    schedule/
  /(parent)
    dashboard/
    children/[id]/
    schedule/
  /(teacher)
    dashboard/
    classes/
    classes/[id]/
    homework/
    homework/[id]/submissions/
  /(admin)
    dashboard/
    users/
    enrollments/
    reports/
  /(public)
    page.tsx              → Landing page
    pricing/
    enroll/
    enroll/success/

/components
  /ui                     → Button, Input, Card, Badge, dll.
  /forms                  → Form components dengan validasi
  /layouts                → Sidebar per role, Header
  /dashboard              → Widget dashboard per role

/lib
  /supabase
    client.ts             → Browser client
    server.ts             → Server client (RSC)
    middleware.ts          → Route protection
  /validations
    auth.ts
    homework.ts
    class.ts
    enrollment.ts
  /stripe
    client.ts
    webhooks.ts
  /email
    templates/
    send.ts

/supabase
  /migrations             → SQL migration files
  /seed                   → Demo seed data
  /types                  → Generated types dari schema

/types
  index.ts                → App-level types
```

---

## 5. Sistem Autentikasi & Permissions

### 5.1 Auth Flow

**Register (Self-serve via Enrollment):**
1. User pilih paket di landing page
2. Bayar via Stripe
3. Stripe webhook trigger → Supabase buat akun student + assign ke kelas
4. Email welcome + set password dikirim via Resend

**Register (Invite oleh Admin/Teacher):**
1. Admin/Teacher kirim invite link via email
2. User klik link → set password → akun aktif dengan role yang sudah ditentukan
3. Untuk parent: setelah register, admin link parent ke student

**Login:**
1. Email + password login via Supabase Auth
2. Setelah login, middleware cek role dari `user_profiles.role`
3. Redirect ke dashboard sesuai role

---

### 5.2 Role & Permission Matrix

| Aksi | Student | Parent | Teacher | Admin |
|---|---|---|---|---|
| Lihat homework sendiri | ✅ | ❌ | ❌ | ✅ |
| Submit homework | ✅ | ❌ | ❌ | ❌ |
| Lihat homework anak | ❌ | ✅ | ❌ | ✅ |
| Buat homework | ❌ | ❌ | ✅ | ✅ |
| Grade submission | ❌ | ❌ | ✅ | ✅ |
| Buat kelas | ❌ | ❌ | ✅ | ✅ |
| Lihat semua user | ❌ | ❌ | ❌ | ✅ |
| Manage enrollment | ❌ | ❌ | ❌ | ✅ |
| Lihat progress anak (grafik) | ❌ | ✅ | ❌ | ✅ |

---

### 5.3 Middleware Route Protection

```typescript
// middleware.ts
const ROLE_ROUTES = {
  student: ['/student'],
  parent: ['/parent'],
  teacher: ['/teacher'],
  admin: ['/admin'],
}

// Setiap request ke route protected:
// 1. Validasi session Supabase
// 2. Ambil role dari user_profiles
// 3. Jika role tidak match → redirect ke dashboard yang benar
// 4. Jika tidak ada session → redirect ke /login
```

---

## 6. Modul Student

### 6.1 Dashboard Student

**Tampilan:**
- Upcoming homework (max 3, sorted by due date)
- Kelas berikutnya (jadwal hari ini / besok)
- Recent grades (3 homework terakhir yang sudah dinilai)
- Completion rate bulan ini (progress bar)

**Data yang dibutuhkan:**
- `homework` WHERE student terdaftar di kelas tersebut
- `homework_submissions` WHERE student_id = user
- `class_sessions` WHERE jadwal ≥ sekarang
- `enrollments` WHERE student_id = user

---

### 6.2 Homework List

**Tampilan:**
- Tabs: Pending | Submitted | Graded
- Per card: judul, nama kelas, due date, status badge

**Logika Status:**
```
PENDING   → belum ada submission dari student ini
SUBMITTED → ada submission, belum ada nilai
GRADED    → ada submission dan sudah ada nilai
OVERDUE   → PENDING dan due_date < sekarang
```

**Filter:** by class, by status  
**Sort:** by due date (default ascending)

---

### 6.3 Homework Detail & Submission

**Tampilan:**
- Judul & deskripsi homework
- Due date dengan countdown timer jika < 24 jam
- Form submission:
  - Text area (rich text sederhana)
  - Upload file (max 10MB, format: pdf, jpg, png, docx)
- Jika sudah submitted: tampilkan submission + status
- Jika sudah graded: tampilkan nilai dan feedback dari teacher

**Validasi:**
- Tidak bisa submit jika sudah GRADED
- Tidak bisa submit jika due_date sudah lewat (soft block: warning, tidak hard block)
- File size validation di client dan server

---

### 6.4 Schedule

- Tampilan calendar / list view
- Class session: nama kelas, waktu mulai-selesai, teacher, status (upcoming/ongoing/done)

---

## 7. Modul Parent

### 7.1 Dashboard Parent

**Tampilan:**
- List children (jika lebih dari 1 anak)
- Per anak: completion rate, nilai rata-rata bulan ini, upcoming deadline
- Quick link ke detail progress tiap anak
- Notification center: homework baru, nilai keluar, kelas besok

---

### 7.2 Children Progress Detail

**Tampilan:**
- Line chart: rata-rata nilai per minggu (8 minggu terakhir)
- Bar chart: homework completion rate per kelas
- Tabel riwayat homework: judul, kelas, nilai, tanggal submit
- Upcoming deadlines

**Data yang bisa dilihat parent:** hanya data anak yang sudah di-link oleh admin

---

### 7.3 Notifikasi

**Trigger notifikasi:**

| Event | In-App | Email |
|---|---|---|
| Homework baru dibuat | ✅ | ✅ |
| Homework deadline < 24 jam | ✅ | ✅ |
| Nilai baru keluar | ✅ | ✅ |
| Kelas besok pagi | ✅ | ❌ |

---

## 8. Modul Teacher

### 8.1 Dashboard Teacher

**Tampilan:**
- Kelas aktif yang diajar
- Homework yang perlu di-review (ada submission, belum dinilai)
- Upcoming class sessions hari ini

---

### 8.2 Class Management

**List Kelas:**
- Nama kelas, jumlah student, status (active/archived)
- Tombol: lihat detail, edit, archive

**Detail Kelas:**
- Info kelas (nama, deskripsi, jadwal)
- Roster student (nama, email, status enrollment)
- List homework yang sudah dibuat untuk kelas ini
- Tombol: tambah student, buat homework baru, tambah session

**Buat/Edit Kelas:**
- Field: nama, deskripsi, kapasitas max student

---

### 8.3 Homework Management

**Buat Homework:**
- Field: judul, deskripsi (rich text), kelas tujuan, due date, max score
- Preview sebelum publish
- Status: draft / published

**List Submission per Homework:**
- Tampilan tabel: nama student, waktu submit, status (submitted/not submitted), nilai
- Filter: sudah dinilai / belum dinilai
- Bulk action: export ke CSV

**Review & Grade Submission:**
- Tampilan split view: submission student (kiri) & form penilaian (kanan)
- Field penilaian: nilai (0 sampai max_score), feedback text
- Auto-notify student & parent setelah grade disimpan

---

## 9. Modul Admin

### 9.1 User Management

**List User:**
- Tabel: nama, email, role, status (active/inactive), tanggal bergabung
- Filter: by role, by status
- Search: by nama atau email
- Aksi per user: lihat detail, nonaktifkan, ubah role

**Buat User Manual:**
- Field: nama, email, role
- Sistem kirim invite email otomatis

**Link Parent ke Student:**
- Pilih parent (dropdown search)
- Pilih student (dropdown search)
- Satu parent bisa punya banyak anak, satu anak bisa punya banyak parent

---

### 9.2 Enrollment Management

**List Enrollment:**
- Tabel: nama student, kelas, paket, status pembayaran, tanggal enroll
- Filter: by status (paid/pending/failed), by kelas
- Aksi: lihat detail, manual enroll (tanpa payment), batalkan enrollment

---

### 9.3 Laporan Operasional

**Reports yang tersedia:**
- Total student aktif per kelas
- Homework completion rate per kelas (persentase)
- Rata-rata nilai per kelas
- Jumlah enrollment per bulan (line chart)

**Export:** download CSV per laporan

---

## 10. Self-Serve Enrollment & Payment

### 10.1 Landing Page

**Sections:**
- Hero: value proposition ClassLoop
- How It Works: 3 langkah (pilih paket → bayar → mulai belajar)
- Pricing cards: minimal 2 paket (contoh: Monthly, Quarterly)
- FAQ: 4–5 pertanyaan umum

---

### 10.2 Enrollment Flow

```
1. User pilih paket di /pricing
2. Redirect ke /enroll → form: nama lengkap, email, nama anak, usia anak
3. Submit form → redirect ke Stripe Checkout (hosted)
4. User bayar di Stripe
5. Stripe kirim webhook → /api/webhooks/stripe
6. Server handler:
   a. Verifikasi webhook signature
   b. Buat user baru di Supabase Auth (role: student)
   c. Insert ke user_profiles
   d. Insert ke enrollments (status: active)
   e. Kirim email welcome via Resend (link set password)
7. Stripe redirect user ke /enroll/success
8. Halaman success: instruksi cek email, link ke FAQ
```

---

### 10.3 Paket & Pricing (Contoh)

| Paket | Harga | Durasi | Jumlah Kelas |
|---|---|---|---|
| Monthly | $29/bulan | 1 bulan | 8 kelas |
| Quarterly | $79/3 bulan | 3 bulan | 24 kelas |

Data paket disimpan di tabel `plans` agar bisa di-manage admin tanpa deploy ulang.

---

## 11. Database Schema

### Tabel Utama

```sql
-- User profiles (extend Supabase auth.users)
CREATE TABLE user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relasi parent-student
CREATE TABLE parent_student_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID NOT NULL REFERENCES user_profiles(id),
  student_id  UUID NOT NULL REFERENCES user_profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- Kelas
CREATE TABLE classes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  teacher_id  UUID NOT NULL REFERENCES user_profiles(id),
  max_students INT DEFAULT 20,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Jadwal sesi kelas
CREATE TABLE class_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Paket harga
CREATE TABLE plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  price_cents     INT NOT NULL,
  currency        TEXT DEFAULT 'usd',
  duration_days   INT NOT NULL,
  class_count     INT NOT NULL,
  stripe_price_id TEXT UNIQUE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment (student ke kelas via pembayaran)
CREATE TABLE enrollments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id          UUID NOT NULL REFERENCES user_profiles(id),
  class_id            UUID NOT NULL REFERENCES classes(id),
  plan_id             UUID REFERENCES plans(id),
  status              TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_session_id   TEXT,
  stripe_payment_id   TEXT,
  enrolled_at         TIMESTAMPTZ DEFAULT NOW(),
  expires_at          TIMESTAMPTZ,
  UNIQUE(student_id, class_id)
);

-- Homework
CREATE TABLE homework (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id  UUID NOT NULL REFERENCES user_profiles(id),
  title       TEXT NOT NULL,
  description TEXT,
  due_at      TIMESTAMPTZ NOT NULL,
  max_score   INT DEFAULT 100,
  status      TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Submission homework oleh student
CREATE TABLE homework_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id     UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES user_profiles(id),
  content         TEXT,
  attachment_url  TEXT,
  score           INT,
  feedback        TEXT,
  graded_at       TIMESTAMPTZ,
  graded_by       UUID REFERENCES user_profiles(id),
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(homework_id, student_id)
);

-- Notifikasi
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_homework_class ON homework(class_id);
CREATE INDEX idx_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX idx_submissions_student ON homework_submissions(student_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_class_sessions_class ON class_sessions(class_id, starts_at);
```

---

## 12. Row Level Security (RLS) Policies

RLS adalah fitur kritis untuk keamanan multi-role. Setiap user hanya bisa membaca dan menulis data yang menjadi haknya, di level database — bukan hanya di aplikasi.

### user_profiles

```sql
-- User bisa lihat profile sendiri
CREATE POLICY "users_view_own" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Teacher bisa lihat profile student di kelasnya
CREATE POLICY "teacher_view_students" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN classes c ON c.id = e.class_id
      WHERE e.student_id = user_profiles.id
        AND c.teacher_id = auth.uid()
    )
  );

-- Parent bisa lihat profile anaknya
CREATE POLICY "parent_view_children" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_student_links
      WHERE parent_id = auth.uid()
        AND student_id = user_profiles.id
    )
  );

-- Admin bisa lihat semua
CREATE POLICY "admin_view_all" ON user_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### homework_submissions

```sql
-- Student hanya bisa lihat & insert submission sendiri
CREATE POLICY "student_own_submissions" ON homework_submissions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "student_insert_submission" ON homework_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Teacher bisa lihat semua submission di kelasnya
CREATE POLICY "teacher_view_class_submissions" ON homework_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM homework hw
      JOIN classes c ON c.id = hw.class_id
      WHERE hw.id = homework_submissions.homework_id
        AND c.teacher_id = auth.uid()
    )
  );

-- Teacher bisa update (grading) submission di kelasnya
CREATE POLICY "teacher_grade_submission" ON homework_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM homework hw
      JOIN classes c ON c.id = hw.class_id
      WHERE hw.id = homework_submissions.homework_id
        AND c.teacher_id = auth.uid()
    )
  );

-- Parent bisa lihat submission anaknya
CREATE POLICY "parent_view_children_submissions" ON homework_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_student_links
      WHERE parent_id = auth.uid()
        AND student_id = homework_submissions.student_id
    )
  );
```

---

## 13. API Design

Semua route menggunakan Next.js Route Handlers (`/app/api/`). Auth di-validasi di setiap handler via Supabase server client.

### Auth Routes

| Method | Path | Deskripsi |
|---|---|---|
| POST | /api/auth/register | Register via invite token |
| POST | /api/auth/logout | Logout & clear session |

### Homework Routes

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| GET | /api/homework | student, teacher | List homework |
| POST | /api/homework | teacher | Buat homework baru |
| GET | /api/homework/[id] | student, teacher, parent | Detail homework |
| PATCH | /api/homework/[id] | teacher | Update homework |
| GET | /api/homework/[id]/submissions | teacher | List semua submission |
| POST | /api/homework/[id]/submissions | student | Submit homework |
| PATCH | /api/homework/[id]/submissions/[sid] | teacher | Grade submission |

### Class Routes

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| GET | /api/classes | teacher, admin | List kelas |
| POST | /api/classes | teacher, admin | Buat kelas baru |
| GET | /api/classes/[id] | semua | Detail kelas |
| PATCH | /api/classes/[id] | teacher, admin | Update kelas |
| GET | /api/classes/[id]/students | teacher, admin | Roster student |

### Enrollment & Payment Routes

| Method | Path | Deskripsi |
|---|---|---|
| GET | /api/plans | List paket aktif |
| POST | /api/checkout | Buat Stripe Checkout session |
| POST | /api/webhooks/stripe | Handler Stripe webhook |

### Admin Routes

| Method | Path | Deskripsi |
|---|---|---|
| GET | /api/admin/users | List semua user |
| POST | /api/admin/users | Buat user + kirim invite |
| PATCH | /api/admin/users/[id] | Update role / status |
| POST | /api/admin/parent-links | Link parent ke student |
| GET | /api/admin/reports/completion | Laporan completion rate |

---

## 14. Non-Functional Requirements

### Performance

- First Contentful Paint (FCP) < 1.5 detik (Vercel Edge)
- API response time < 500ms untuk query umum
- Supabase query dioptimalkan dengan index dan select spesifik (tidak `SELECT *`)
- Gunakan React Suspense + loading skeleton untuk semua data async

### Security

- Semua route protected dengan session check di middleware
- RLS aktif di semua tabel sensitif
- Input validation dengan Zod di server side (tidak hanya client)
- Stripe webhook diverifikasi dengan `stripe.webhooks.constructEvent`
- File upload: validasi tipe file dan ukuran di server
- Environment variables tidak boleh exposed ke client (prefix `NEXT_PUBLIC_` hanya untuk yang aman)

### Reliability

- Database migrations menggunakan Supabase CLI (bukan manual SQL)
- Seed data tersedia untuk demo environment
- Error tidak boleh expose detail teknis ke user (stack trace, query error, dll.)
- Semua mutasi kritis (submit, grade, payment) di-wrap dengan error handling eksplisit

### Accessibility

- Form fields wajib punya label
- Tombol dengan icon wajib punya `aria-label`
- Warna tidak jadi satu-satunya penanda status (selalu ada teks/icon juga)

---

## 15. Error Handling & Validasi

### Prinsip

- **Server-side validation selalu ada.** Client validation hanya untuk UX, bukan keamanan.
- **Error message untuk user harus human-friendly.** Bukan "Internal Server Error" atau Postgres error langsung.
- **Logging error ke console di development, ke monitoring di production.**

### Zod Validation Schema (contoh)

```typescript
// lib/validations/homework.ts
import { z } from 'zod'

export const createHomeworkSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(200),
  description: z.string().optional(),
  class_id: z.string().uuid('Class ID tidak valid'),
  due_at: z.string().datetime().refine(
    date => new Date(date) > new Date(),
    'Due date harus di masa depan'
  ),
  max_score: z.number().int().min(1).max(1000).default(100),
})

export const submitHomeworkSchema = z.object({
  content: z.string().min(1, 'Jawaban tidak boleh kosong').max(10000).optional(),
  attachment_url: z.string().url().optional(),
}).refine(
  data => data.content || data.attachment_url,
  'Harus ada jawaban teks atau file yang diupload'
)
```

### HTTP Status Codes

| Situasi | Status Code |
|---|---|
| Sukses buat resource | 201 Created |
| Sukses update/delete | 200 OK |
| Validasi gagal | 400 Bad Request |
| Tidak terautentikasi | 401 Unauthorized |
| Tidak punya akses | 403 Forbidden |
| Resource tidak ditemukan | 404 Not Found |
| Error server | 500 Internal Server Error |

---

## 16. Deployment & DevOps

### Environments

| Environment | Branch | URL | Keterangan |
|---|---|---|---|
| Development | local | localhost:3000 | .env.local |
| Preview | feature/* | auto Vercel | Preview per PR |
| Production | main | classloop.vercel.app | Live demo |

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
EMAIL_FROM=

# App
NEXT_PUBLIC_APP_URL=
```

### Database Migration Workflow

```bash
# Buat migration baru
supabase migration new add_notifications_table

# Apply ke local
supabase db push

# Apply ke production
supabase db push --linked
```

### Seed Data

Tersedia script seed untuk membuat akun demo siap pakai:

```
student@demo.com   / Demo1234!  → role: student
parent@demo.com    / Demo1234!  → role: parent (linked ke demo student)
teacher@demo.com   / Demo1234!  → role: teacher
admin@demo.com     / Demo1234!  → role: admin
```

Seed juga membuat: 2 kelas, 5 homework (berbagai status), 3 submission dengan nilai.

---

## 17. Milestones & Timeline

### Estimasi: 3 Minggu

#### Minggu 1 — Foundation & Auth

| Hari | Task |
|---|---|
| 1 | Setup project: Next.js + Supabase + Tailwind + TypeScript strict |
| 1 | Buat database schema + migrations awal |
| 2 | Setup RLS policies untuk semua tabel |
| 2 | Generate Supabase types ke TypeScript |
| 3 | Auth flow: login, register via invite, middleware |
| 3 | Role-based routing & redirect logic |
| 4 | Layout per role: sidebar, header, navigasi |
| 4 | Dashboard skeleton per role |
| 5 | Buffer: debug, polish, testing auth edge cases |

#### Minggu 2 — Core Features

| Hari | Task |
|---|---|
| 6 | Teacher: buat kelas, list kelas, detail kelas |
| 6 | Teacher: buat homework, list homework |
| 7 | Student: list homework dengan status logic |
| 7 | Student: homework detail + submission form |
| 8 | Teacher: list submission, grade + feedback form |
| 8 | Notifikasi in-app: create, mark as read |
| 9 | Parent: dashboard, progress grafik |
| 9 | Admin: user management, link parent-student |
| 10 | Buffer: bug fix, edge cases, RLS testing |

#### Minggu 3 — Enrollment, Polish & Deploy

| Hari | Task |
|---|---|
| 11 | Landing page + pricing page |
| 11 | Stripe Checkout integration |
| 12 | Stripe webhook handler + auto provisioning |
| 12 | Email via Resend: welcome, notifikasi |
| 13 | Admin: enrollment management, laporan |
| 13 | File upload untuk submission homework |
| 14 | Seed data + demo accounts |
| 14 | Deploy ke Vercel, environment setup production |
| 15 | End-to-end testing semua flow, README lengkap |

---

## 18. Out of Scope

Berikut fitur yang **sengaja tidak dibangun** di v1, beserta alasannya:

| Fitur | Alasan Ditunda |
|---|---|
| Live video class | Perlu third-party (Zoom/Agora), di luar scope platform |
| Real-time chat | Kompleksitas WebSocket, v2 feature |
| Mobile app | Web responsive sudah cukup untuk demo |
| AI grading otomatis | Out of scope, bukan masalah utama Ottodot saat ini |
| Gamifikasi (badge, XP) | Fitur sekunder, fokus dulu ke core workflow |
| Multi-bahasa | Cukup bahasa Inggris untuk portfolio |
| Dark mode | Nice to have, bukan prioritas |
| Roblox integration | Domain berbeda, di luar konteks project ini |

---

## 19. Success Metrics

Project ini dianggap berhasil jika memenuhi semua kriteria berikut:

### Demo Readiness
- [ ] Semua 4 role bisa login dan mengakses dashboard masing-masing
- [ ] Demo accounts berfungsi tanpa error
- [ ] Full homework flow berjalan: buat → submit → grade → parent lihat nilai
- [ ] Stripe payment flow berhasil (test mode) dan akun otomatis dibuat

### Technical Quality
- [ ] Tidak ada RLS bypass: student tidak bisa akses data student lain
- [ ] Semua form memiliki server-side validation
- [ ] Error message user-friendly di semua flow utama
- [ ] TypeScript strict mode aktif tanpa error
- [ ] Database migrations terdokumentasi dan reproducible

### Code Quality
- [ ] README lengkap: arsitektur, setup lokal, demo accounts
- [ ] Folder structure jelas dan konsisten
- [ ] Tidak ada secret di git history
- [ ] Deployed dan bisa diakses publik

---

## 20. Known Trade-offs & Keputusan Teknis

Bagian ini menunjukkan bahwa engineer memahami trade-off, bukan hanya mengikuti tutorial.

### Menggunakan Supabase Auth bukan NextAuth

**Keputusan:** Pakai Supabase Auth built-in.  
**Alasan:** Stack Ottodot menggunakan Supabase, dan Supabase Auth terintegrasi langsung dengan RLS. NextAuth memerlukan adapter tambahan dan kehilangan keuntungan RLS native.  
**Trade-off:** Supabase Auth lebih opinionated dan kurang fleksibel untuk custom auth flow yang kompleks.

---

### RLS di database, bukan hanya di aplikasi

**Keputusan:** Semua permission check ada di RLS level, bukan hanya middleware.  
**Alasan:** Defense in depth — bahkan jika ada bug di middleware atau route handler, data sensitif tetap aman di level database.  
**Trade-off:** RLS policies lebih sulit di-debug dan di-test daripada aplikasi-level check.

---

### Stripe Hosted Checkout bukan Custom Checkout

**Keputusan:** Gunakan Stripe Checkout hosted page.  
**Alasan:** Lebih cepat implement, PCI compliant by default, tidak perlu handle card input sendiri. Untuk portfolio ini, UX dari Stripe cukup.  
**Trade-off:** Kurang kontrol terhadap tampilan dan flow payment.

---

### Tidak menggunakan Prisma / Drizzle ORM

**Keputusan:** Gunakan Supabase JS client langsung.  
**Alasan:** Supabase JS client sudah type-safe dengan generated types, dan lebih terintegrasi dengan RLS. ORM pihak ketiga memerlukan konfigurasi tambahan dan bisa bypass RLS jika tidak hati-hati.  
**Trade-off:** Query yang kompleks (banyak join) lebih verbose daripada menggunakan ORM.

---

### Next.js App Router bukan Pages Router

**Keputusan:** Gunakan App Router (Next.js 14+).  
**Alasan:** Server Components memungkinkan data fetching langsung di komponen tanpa API call tambahan. Lebih modern dan arah Next.js ke depan.  
**Trade-off:** Kurva belajar lebih tinggi, beberapa library belum support penuh.

---

*Dokumen ini adalah living document — update seiring progress development.*

---

**ClassLoop PRD v1.0** · Portfolio Project untuk Ottodot Full Stack Engineer Role
