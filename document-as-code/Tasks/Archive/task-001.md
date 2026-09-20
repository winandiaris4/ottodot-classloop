---
id: "001"
title: "Project Setup: Init Next.js 15 + TypeScript + Tailwind v4 + Shadcn/ui"
status: "DONE"
urgency: "HIGH"
category: "DevOps"
created_at: "2026-09-20"
blocked_by: []
blocks: ["002"]
source_spec: "Specs/brief.md"
---

## 🔍 Analisis Teknis

Setup project ClassLoop dari nol. Tujuannya adalah menghasilkan project Next.js 15 yang siap dikembangkan dengan stack lengkap: TypeScript strict, Tailwind v4, Shadcn/ui, dan semua dependencies yang dibutuhkan.

Setelah task ini selesai, project harus bisa dijalankan di localhost:3000 dengan halaman default yang bersih.

## 📝 Sub-Tasks Breakdown

- [x] Init project Next.js 15 dengan TypeScript, App Router, Tailwind CSS, ESLint
      *Verification:* `npm run dev` berjalan tanpa error di localhost:3000

- [x] Install Shadcn/ui dan jalankan init
      *Verification:* `components/ui/` folder terbentuk, `components.json` ada di root

- [x] Install semua dependencies project: supabase-js, zod, stripe, resend
      *Verification:* `npm ls @supabase/supabase-js zod stripe resend` menampilkan versi tanpa error

- [x] Setup folder structure sesuai Specs/brief.md (lib/, types/, supabase/)
      *Verification:* Folder `src/lib/supabase/`, `src/lib/validations/`, `src/types/`, `supabase/migrations/`, `supabase/seed/` terbentuk

- [x] Buat file konfigurasi dasar: Supabase client (browser & server), types placeholder, middleware placeholder
      *Verification:* File `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/types/index.ts`, `src/middleware.ts` ada dan tidak ada TypeScript error

- [x] Verifikasi TypeScript strict mode aktif dan project build sukses
      *Verification:* `npm run build` selesai tanpa type error ✅ (compiled in 551ms)

## 📎 Referenced Files
- `Specs/brief.md` — stack teknologi dan folder structure target
- `package.json` — dependencies
- `tsconfig.json` — TypeScript config
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/middleware.ts`
- `src/types/index.ts`

## 💬 Notes
- Gunakan `--use-npm` untuk konsistensi package manager
- TypeScript strict mode wajib aktif di `tsconfig.json`
- Shadcn/ui style: `default`, base color: `slate`
- Tailwind v4 sudah include dengan Next.js 15 init terbaru

