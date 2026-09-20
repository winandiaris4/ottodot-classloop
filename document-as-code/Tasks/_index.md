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
| 008 | `TODO` | `MEDIUM` | `Frontend` | Modul Parent: Dashboard Progress Anak, Grafik Nilai | 004, 005 |
| 009 | `TODO` | `MEDIUM` | `Frontend` | Modul Admin: User Management, Link Parent-Student, Laporan | 004, 005 |
| 010 | `TODO` | `MEDIUM` | `Backend` | Notifikasi: In-app Notification + Email via Resend | 006, 007 |
| 011 | `TODO` | `MEDIUM` | `Backend` | Self-serve Enrollment: Landing Page + Stripe Checkout + Webhook | 002, 004, 009 |
| 012 | `DONE` | `HIGH` | `DevOps` | Seed Data & Demo Accounts (4 role, kelas, homework, submission) | 002, 003 |
| 013 | `TODO` | `HIGH` | `QA` | Integration QA: End-to-end Flow Verification (semua role & core flows) | 006, 007, 008, 009, 010, 011 |
| 014 | `TODO` | `LOW` | `DevOps` | Deploy ke Vercel + Environment Setup Production + README Lengkap | 013 |

---

## 📋 Backlog
> 💡 **Panduan AI**: Baris-baris ini hanya ide fitur/tugas masa depan. **DILARANG** membuat file `.md` untuk item di bawah ini sampai dipromosikan menjadi Active Task.

| ID  | Judul Ide / Fitur Masa Depan | Kategori | Urgensi | Catatan / Deskripsi Singkat |
| --- | ---------------------------- | -------- | ------- | --------------------------- |
| B01 | Real-time notifikasi via Supabase Realtime | `Backend` | `LOW` | Upgrade dari polling ke WebSocket push |
| B02 | Export laporan ke CSV | `Frontend` | `LOW` | Admin download laporan completion rate |
| B03 | Dark Mode | `Frontend` | `LOW` | CSS variables + Tailwind dark class |
| B04 | File preview untuk submission homework | `Frontend` | `LOW` | Preview PDF/image inline tanpa download |
| B05 | Unit & Integration Tests | `QA` | `MEDIUM` | Vitest untuk server logic, Playwright untuk e2e |

---

*Last updated: 2026-09-20*

