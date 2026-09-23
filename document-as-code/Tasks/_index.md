# Tasks Index

> 📌 **Panduan AI**: Baca HANYA file ini saat triaging. Buka `task-[ID].md` HANYA saat task tersebut akan dikerjakan. JANGAN pernah membaca folder `/Tasks/Archive/` kecuali diminta secara eksplisit.

## Status Legend
| Status        | Keterangan           |
| ------------- | -------------------- |
| `TODO`        | Belum dimulai        |
| `IN_PROGRESS` | Sedang dikerjakan    |
| `DONE`        | Selesai & diarsipkan |
| `BLOCKED`     | Menunggu dependensi  |

## Urgency Legend
| Urgensi  | Keterangan                               |
| -------- | ---------------------------------------- |
| `HIGH`   | Harus segera dikerjakan, berdampak besar |
| `MEDIUM` | Penting, bisa dijadwalkan                |
| `LOW`    | Nice-to-have, dikerjakan kalau ada waktu |

## ⚠️ Aturan Folder & Kategori
*   **DILARANG** membuat subdirectory baru di dalam folder `/Tasks/` (seperti `/Tasks/frontend/`). Semua task harus disimpan langsung di bawah `/Tasks/`.
*   Untuk membedakan scope (Frontend, Backend, DevOps, dsb.), gunakan kolom **Kategori** pada tabel di bawah atau tambahkan field `category` pada Front Matter di file `task-[ID].md`.

---

## Active Tasks

| ID  | Status | Urgensi | Kategori | Judul Tugas | Deps |
| --- | ------ | ------- | -------- | ----------- | ---- |
| 001 | `DONE` | `HIGH` | `DevOps` | Project Setup: Init Next.js 15 + TypeScript + Tailwind v4 + Shadcn/ui | - |
| 002 | `DONE` | `HIGH` | `Database` | Database Schema + Migrations (8 tabel utama + indexes) | 001 |
| 003 | `DONE` | `HIGH` | `Database` | RLS Policies + Supabase TypeScript Type Generation | 002 |
| 004 | `DONE` | `HIGH` | `Backend` | Auth System: Login, Invite Flow, Middleware Role-based Routing | 003 |
| 005 | `DONE` | `HIGH` | `Frontend` | Layout per Role: Sidebar, Header, Navigation + Dashboard Skeleton | 004 |
| 006 | `DONE` | `HIGH` | `Frontend` | Modul Teacher: Kelola Kelas, Buat Homework, Grade Submission | 004, 005 |
| 007 | `DONE` | `HIGH` | `Frontend` | Modul Student: Homework List, Submit, Lihat Nilai & Feedback | 004, 005 |
| 008 | `DONE` | `MEDIUM` | `Frontend` | Modul Parent: Dashboard Progress Anak, Grafik Nilai | 004, 005 |
| 009 | `DONE` | `MEDIUM` | `Frontend` | Modul Admin: User Management, Link Parent-Student, Laporan | 004, 005 |
| 010 | `DONE` | `MEDIUM` | `Backend` | Notifikasi: In-app Notification + Email via Resend | 006, 007 |
| 011 | `DONE` | `MEDIUM` | `Backend` | Self-serve Enrollment: Landing Page + Stripe Checkout + Webhook | 002, 004, 009 |
| 012 | `DONE` | `HIGH` | `DevOps` | Seed Data & Demo Accounts (4 role, kelas, homework, submission) | 002, 003 |
| 013 | `DONE` | `HIGH` | `QA` | Integration QA: End-to-end Flow Verification (semua role & core flows) | 006, 007, 008, 009, 010, 011 |
| 014 | `DONE` | `LOW` | `DevOps` | Deploy ke Vercel + Environment Setup Production + README Lengkap | 013 |
| 015 | `DONE` | `HIGH` | `Frontend` | Enterprise Header & Navigation Polish: Consolidated Profile Dropdown & Clean Sidebar | 005, 009 |
| 016 | `DONE` | `HIGH` | `Frontend` | Enterprise User Management UI: Data Density, Masked UUIDs, Action Hierarchy & Table Pagination | 009, 015 |
| 017 | `DONE` | `HIGH` | `Frontend` | Enterprise Dashboard Redesign: Clean Page Header, Consolidated Metrics & KPI Visuals | 009, 015 |
| 018 | `DONE` | `HIGH` | `Frontend` | Playful STEM EdTech Landing Page Redesign (Cosmic Hero, Mascot & Bright Course Showcase) | 017 |
| 019 | `DONE` | `HIGH` | `Frontend` | Course Catalog Hub (/courses) & Interactive Course Detail Page (/courses/[id]) | 018 |

---

## 📋 Backlog
> 💡 **Panduan AI**: Baris-baris ini adalah ide fitur masa depan. Detail arsitektur & RICE scoring tersimpan di [feature-backlog-roadmap.md](file:///home/aris/aris/Project/ottodot/document-as-code/brainstorming/feature-backlog-roadmap.md). **DILARANG** membuat file `.md` untuk item di bawah ini sampai dipromosikan menjadi Active Task.

| ID  | Judul Ide / Fitur Masa Depan | Kategori | Urgensi | Catatan / Deskripsi Singkat |
| --- | ---------------------------- | -------- | ------- | --------------------------- |
| B01 | Direct File Upload & Supabase Storage | `Storage` | `HIGH` | Upload materi PDF/slides & lampiran submission homework |
| B02 | Class Attendance & Live Session Launcher | `Frontend/Backend` | `HIGH` | Presensi siswa (P/A/L/E) & 1-click launcher Zoom/Meet |
| B03 | Teacher-Parent Progress Notes & Feedback | `Communication` | `MEDIUM` | Catatan perkembangan berkala anak & parent timeline feed |
| B04 | Export Laporan & Raport (CSV / Excel / PDF) | `Reports` | `MEDIUM` | Download CSV data admin & generate Student Report Card PDF |
| B05 | Admin Course & Plan Builder GUI | `Admin` | `MEDIUM` | CRUD Visual courses, modules, & Stripe pricing tier mapping |
| B06 | Real-time Push Notifications (Supabase Realtime) | `Backend` | `LOW` | WebSocket push alert instant tanpa refresh halaman |
| B07 | Gamification & Badges (XP / Streaks) | `Gamification` | `LOW` | Sistem poin keaktifan, streak kelas & lencana pencapaian |
| B08 | Dark Mode & Theme Switcher | `Frontend` | `LOW` | CSS variables + Tailwind dark class |
| B09 | Automated QA Suite (Vitest + Playwright) | `QA` | `MEDIUM` | Vitest untuk server logic, Playwright untuk e2e testing |

---

*Last updated: 2026-09-23 (Synced with feature-backlog-roadmap.md)*

