---
id: "002"
title: "Database Schema + Migrations (8 tabel utama + indexes)"
status: "DONE"
urgency: "HIGH"
category: "Database"
created_at: "2026-09-20"
blocked_by: ["001"]
blocks: ["003", "011", "012"]
source_spec: "Specs/architecture.md"
---

## 🔍 Analisis Teknis

Membuat file SQL migration pertama yang mencakup seluruh skema database inti ClassLoop sesuai dengan `Specs/architecture.md` dan `PRD-ClassLoop.md`.

Skema ini mendefinisikan:
1. Tabel profil pengguna (`user_profiles`) yang terhubung dengan `auth.users`
2. Relasi keluarga (`parent_student_links`)
3. Manajemen kelas & sesi (`classes`, `class_sessions`)
4. Paket berlangganan & enrollment (`plans`, `enrollments`)
5. Tugas & pengumpulan (`homework`, `homework_submissions`)
6. Notifikasi (`notifications`)
7. Trigger otomatis: auto `updated_at` & auto-provisioning `user_profiles` saat user baru terdaftar di Supabase Auth
8. Indexes komprehensif untuk performa query relasional

## 📝 Sub-Tasks Breakdown

- [x] Buat file SQL migration `supabase/migrations/20260920000001_initial_schema.sql`
      *Verification:* File migration valid secara sintaks SQL PostgreSQL dan mencakup semua 8+ tabel beserta constraint
- [x] Tambahkan trigger `handle_updated_at` dan `handle_new_user` (sinkronisasi `auth.users` ke `user_profiles`)
      *Verification:* Function dan trigger SQL didefinisikan dengan benar di migration file
- [x] Tambahkan seluruh index komprehensif pada foreign keys dan kolom filter penting
      *Verification:* Index untuk `enrollments`, `homework`, `homework_submissions`, `class_sessions`, dan `notifications` lengkap
- [x] Verifikasi dan dokumentasikan cara eksekusi migration ke Supabase
      *Verification:* File migration siap di-push ke Supabase Cloud melalui CLI / SQL Editor

## 📎 Referenced Files
- `Specs/architecture.md` — ERD dan spesifikasi tabel
- `docs/PRD-ClassLoop.md` — Database Schema section
- `supabase/migrations/20260920000001_initial_schema.sql`

## 💬 Notes
- RLS policies akan dikelola di Task 003 secara terpisah agar mudah diverifikasi dan di-audit
