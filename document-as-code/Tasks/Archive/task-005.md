---
id: "005"
title: "Layout per Role: Sidebar, Header, Navigation + Dashboard Skeleton"
status: "DONE"
urgency: "HIGH"
category: "Frontend"
created_at: "2026-09-20"
blocked_by: ["004"]
blocks: ["006", "007", "008", "009"]
source_spec: "Specs/architecture.md"
---

## 🔍 Analisis Teknis

Membangun fondasi tata letak (Dashboard Layout & Navigation) yang dinamis dan terisolasi untuk 4 persona pengguna ClassLoop:
- **Student**: Navigasi ke Dashboard, Homework, Schedule
- **Teacher**: Navigasi ke Dashboard, Classes, Homework Management
- **Parent**: Navigasi ke Dashboard, Children Progress, Schedule
- **Admin**: Navigasi ke Dashboard, Users, Enrollments, Reports

Setiap layout dilengkapi dengan:
1. Sidebar responsif (desktop & mobile drawer) dengan indikator rute aktif
2. Header dengan info user profil, role badge, status indikator, dan menu logout
3. Dashboard skeleton & placeholder widgets untuk masing-masing role

## 📝 Sub-Tasks Breakdown

- [x] Tambahkan komponen UI pendukung Shadcn (`avatar`, `dropdown-menu`, `separator`, `skeleton`, `sheet`)
      *Verification:* Komponen terpasang di `src/components/ui/`
- [x] Buat komponen navigasi bersama di `src/components/layouts/` (`AppSidebar.tsx`, `AppHeader.tsx`, `DashboardShell.tsx`)
      *Verification:* Komponen merender navigasi yang dinamis sesuai role yang aktif
- [x] Buat Layout & Dashboard Skeleton untuk Student di `src/app/(student)/`
      *Verification:* Halaman `/student/dashboard` dapat diakses dengan layout student
- [x] Buat Layout & Dashboard Skeleton untuk Teacher di `src/app/(teacher)/`
      *Verification:* Halaman `/teacher/dashboard` dapat diakses dengan layout teacher
- [x] Buat Layout & Dashboard Skeleton untuk Parent di `src/app/(parent)/`
      *Verification:* Halaman `/parent/dashboard` dapat diakses dengan layout parent
- [x] Buat Layout & Dashboard Skeleton untuk Admin di `src/app/(admin)/`
      *Verification:* Halaman `/admin/dashboard` dapat diakses dengan layout admin
- [x] Verifikasi seluruh route dashboard dan pastikan build TypeScript berhasil
      *Verification:* `npm run build` selesai tanpa error

## 📎 Referenced Files
- `src/components/layouts/AppSidebar.tsx`
- `src/components/layouts/AppHeader.tsx`
- `src/components/layouts/DashboardShell.tsx`
- `src/app/(student)/layout.tsx` & `dashboard/page.tsx`
- `src/app/(teacher)/layout.tsx` & `dashboard/page.tsx`
- `src/app/(parent)/layout.tsx` & `dashboard/page.tsx`
- `src/app/(admin)/layout.tsx` & `dashboard/page.tsx`
