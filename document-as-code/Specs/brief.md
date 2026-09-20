---
id: S01
title: Technical Reference & Configurations
status: APPROVED
type: SYSTEM_DESIGN
created_at: 2026-09-20
author: Aris
---

# Project Brief — Technical Reference

> 📌 **Panduan AI**: Baca file ini untuk memahami struktur kode dan stack teknologi proyek.
> Gunakan nilai `Source Dir` sebagai root pencarian file — jangan scan seluruh repo.

---

## 🎯 Nama Proyek
**ClassLoop** — Edtech Class Management Platform  
Portfolio project untuk melamar posisi Full Stack Engineer di Ottodot.

## 📂 Struktur Folder Kode
> ⚠️ **Panduan AI**: Baca bagian ini sebelum menyentuh file apapun.
> Selalu gunakan path ini sebagai root pencarian kode — jangan scan seluruh repo.

- **Source Dir**: `/` (root project, belum di-init — Next.js project akan dibuat di sini)
- **Entry Point**: `src/app/page.tsx` (setelah project di-init)
- **Config Files**: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local`
- **Test Dir**: `(belum setup)`

### Struktur Folder Target (setelah init)

```
/
├── src/
│   └── app/
│       ├── (auth)/              → login, register, invite flow
│       ├── (student)/           → Protected: role=student
│       ├── (parent)/            → Protected: role=parent
│       ├── (teacher)/           → Protected: role=teacher
│       ├── (admin)/             → Protected: role=admin
│       ├── (public)/            → Landing page, pricing, enrollment
│       └── api/                 → Route handlers (webhooks, server actions)
├── components/
│   ├── ui/                      → Shadcn/ui base components
│   ├── forms/                   → Form components dengan validasi
│   ├── layouts/                 → Sidebar per role, Header
│   └── dashboard/               → Widget dashboard per role
├── lib/
│   ├── supabase/
│   │   ├── client.ts            → Browser client
│   │   ├── server.ts            → Server client (RSC)
│   │   └── middleware.ts        → Route protection
│   ├── validations/             → Zod schemas
│   └── stripe/                  → Stripe client & webhook handlers
├── supabase/
│   ├── migrations/              → SQL migration files
│   └── seed/                    → Demo seed data
└── types/
    └── index.ts                 → App-level types
```

## 🛠️ Stack Teknologi

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS | v4 |
| Component Library | Shadcn/ui | latest |
| Database | Supabase (Postgres) | latest |
| Auth | Supabase Auth | built-in |
| File Storage | Supabase Storage | built-in |
| Payment | Stripe (test mode) | latest |
| Email | Resend | latest |
| Validation | Zod | latest |
| Deploy | Vercel | - |

## 👥 Stakeholder
- **Owner / Client**: Ottodot (target employer — portofolio konteks)
- **Developer**: Aris (solo developer)
- **Target User**: Student (anak 8–15 thn), Parent, Teacher, Admin

## 📅 Timeline
- **Mulai**: September 2026
- **Target Selesai**: Sesegera mungkin (prioritas: Auth + Homework flow dulu)
- **Milestone Utama**:
  - Minggu 1: Foundation + Auth + Role-based routing
  - Minggu 2: Core features (Homework, Teacher, Parent, Admin)
  - Minggu 3: Enrollment + Stripe + Polish + Deploy

## 📦 Scope / Fitur Utama
1. Auth multi-role (Student, Parent, Teacher, Admin) dengan Supabase Auth
2. Row Level Security (RLS) di semua tabel sensitif
3. Modul Student: homework list, submit, lihat nilai & feedback
4. Modul Teacher: buat kelas, buat homework, grade submission
5. Modul Parent: progress chart anak, notifikasi
6. Modul Admin: user management, link parent-student, laporan
7. Self-serve Enrollment: Landing page + Stripe payment + auto-provisioning
8. Notifikasi: in-app + email (Resend)

## 🚫 Out of Scope (v1)
- Live video class / Zoom integration
- Mobile app native
- AI-based grading otomatis
- Gamifikasi (badge, XP, leaderboard)
- Roblox integration
- Multi-bahasa
- Real-time chat
- Dark mode

## 🔗 Referensi & Dokumen Terkait
- PRD lengkap: `docs/PRD-ClassLoop.md`
- Job description Ottodot: `docs/letter.md`
- Analisis job: `docs/analyse.md`
- Spec index: `Specs/_index.md`

---

*Terakhir diperbarui: 2026-09-20*
