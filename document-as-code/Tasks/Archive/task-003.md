---
id: "003"
title: "RLS Policies + Supabase TypeScript Type Generation"
status: "DONE"
urgency: "HIGH"
category: "Database"
created_at: "2026-09-20"
blocked_by: ["002"]
blocks: ["004", "012"]
source_spec: "Specs/architecture.md"
---

## 🔍 Analisis Teknis

Menerapkan Row Level Security (RLS) di seluruh tabel database ClassLoop untuk menjamin isolasi data multi-role yang kuat di level PostgreSQL (defense in depth):
- **Student**: Hanya bisa membaca & memodifikasi data miliknya sendiri.
- **Teacher**: Bisa membaca & menilai submission student di kelas yang diajarnya.
- **Parent**: Hanya bisa melihat data perkembangan akademik anak yang telah ditautkan oleh Admin.
- **Admin**: Memiliki akses supervisi penuh ke seluruh entitas.

Setelah migrasi RLS di-push ke database cloud Supabase, script type generation dijalankan untuk memperbarui `src/types/database.types.ts`.

## 📝 Sub-Tasks Breakdown

- [x] Buat file migration SQL `supabase/migrations/20260920000002_rls_policies.sql` dengan RLS policies lengkap untuk semua tabel
      *Verification:* RLS di-enable di semua tabel (`user_profiles`, `parent_student_links`, `classes`, `class_sessions`, `plans`, `enrollments`, `homework`, `homework_submissions`, `notifications`)
- [x] Push migration RLS ke Supabase Cloud via Supabase CLI
      *Verification:* `npx supabase db push` berhasil mengaplikasikan `20260920000002_rls_policies.sql` tanpa error
- [x] Regenerate TypeScript types dari schema database remote
      *Verification:* File `src/types/database.types.ts` ter-generate otomatis dan sinkron dengan schema Supabase
- [x] Buat helper typed Supabase client dengan `Database` types
      *Verification:* `src/lib/supabase/client.ts` dan `src/lib/supabase/server.ts` menggunakan tipe `Database` generik

## 📎 Referenced Files
- `Specs/architecture.md` — RLS Strategy section
- `docs/PRD-ClassLoop.md` — Section 12 RLS Policies
- `supabase/migrations/20260920000002_rls_policies.sql`
- `src/types/database.types.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
