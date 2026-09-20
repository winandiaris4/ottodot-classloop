---
id: S02
title: Vision & Product Scope (Fase 0)
status: APPROVED
type: SYSTEM_DESIGN
created_at: 2026-09-20
author: Aris
---

# Vision — Discovery & Problem Statement

> 📌 **Panduan AI**: File ini berisi definisi tujuan bisnis proyek (Fase 0).
> Baca file ini saat user meminta breakdown fitur dari perspektif bisnis/produk,
> atau saat membuat task kategori `Product` dan `Strategy`.

---

## 🎯 Problem Statement

Ottodot adalah edtech startup yang membangun platform live class dan game-based learning (200+ Roblox games) untuk anak-anak. Mereka kini membangun **platform layer** di atas produk game mereka: homework, parent visibility, teacher workflow, dan self-serve enrollment.

**Masalah yang ada:**
- Platform dibangun cepat oleh founder (high technical debt, belum stabil)
- Tidak ada sistem terpusat untuk student, parent, teacher, dan admin
- Parent tidak punya visibilitas real-time terhadap progress anak
- Teacher kesulitan melacak siapa yang sudah/belum submit homework
- Tidak ada self-serve enrollment — user harus daftar manual

**Konteks portfolio:** ClassLoop adalah simulasi teknis dari masalah nyata Ottodot, dibangun untuk membuktikan kemampuan full-stack di stack yang identik.

## 👤 Target User

| Role | Segmen | Pain Point Utama |
|---|---|---|
| **Student** | Anak 8–15 tahun | Lupa deadline, tidak tahu ada feedback baru |
| **Parent** | Orang tua / wali | Tidak tahu apakah anak belajar, tidak ada visibilitas nilai |
| **Teacher** | Guru / instruktur | Susah lacak submission, tidak ada sistem feedback sistematis |
| **Admin** | Tim Ottodot | Kelola user manual, tidak ada dashboard operasional |

## 💎 Unique Value Proposition

> Platform edtech multi-role yang menghubungkan student, parent, teacher, dan admin dalam satu sistem — dengan keamanan data di level database (RLS), bukan hanya middleware.

Yang membedakan dari generic CRUD app:
- **Defense in depth**: RLS di Postgres, bukan hanya route protection
- **Multi-role isolation**: setiap role hanya melihat data yang menjadi haknya
- **Production-grade**: validasi Zod di server, error handling eksplisit, migration terdokumentasi
- **Self-serve enrollment**: user bisa daftar dan bayar mandiri tanpa admin

## 🏁 MVP Scope (v1.0)

> Prioritas: **Auth + Homework flow** — ini yang paling kritis untuk didemonstrasikan.

### Fase 1 — Foundation & Auth (Prioritas Tertinggi)
- [x] Project setup: Next.js 15 + TypeScript + Tailwind v4 + Shadcn/ui
- [ ] Database schema + migrations (semua 8 tabel)
- [ ] RLS policies untuk semua tabel
- [ ] Auth flow: login, register via invite, middleware role-based routing
- [ ] Layout per role (sidebar, header, navigasi)
- [ ] Dashboard skeleton per role

### Fase 2 — Core Features
- [ ] Teacher: buat kelas, buat homework, grade submission
- [ ] Student: list homework, submit, lihat nilai & feedback
- [ ] Parent: dashboard progress anak, grafik nilai
- [ ] Admin: user management, link parent-student
- [ ] Notifikasi in-app

### Fase 3 — Enrollment & Polish
- [ ] Landing page + pricing
- [ ] Stripe Checkout + webhook + auto-provisioning akun
- [ ] Email notifikasi via Resend
- [ ] Seed data & demo accounts
- [ ] Deploy ke Vercel + README lengkap

## 🔮 Future Scope (Post-MVP)
- Real-time chat antara teacher dan student/parent
- Live video class integration (Zoom/Agora)
- Mobile app native
- AI-based grading otomatis
- Gamifikasi: badge, XP, leaderboard
- Roblox game integration
- Multi-bahasa

## ⚠️ Constraint & Assumption

- **Budget**: Free tier semua service (Supabase, Vercel, Resend, Stripe test mode)
- **Timeline**: Sesegera mungkin — auth + homework flow didahulukan
- **Tim**: Solo developer (1 orang)
- **Platform**: Web-first, responsive — mobile app out of scope
- **Stack**: Identik dengan Ottodot (Next.js, Supabase, Vercel) — tidak boleh diganti
- **Payment**: Stripe test mode — tidak butuh live credentials
- **PRD**: Living document — bisa diupdate jika ada keputusan yang berubah

---

*Terakhir diperbarui: 2026-09-20*
