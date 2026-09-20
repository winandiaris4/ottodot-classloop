---
id: "003"
title: "Implement Login & Register API Endpoints"
status: "BLOCKED"
urgency: "HIGH"
category: "Backend"
created_at: "2026-07-02"
blocked_by: ["002"]
blocks: []
---

## 🔍 Analisis Teknis

Kita akan membuat router dan controller backend untuk menghandle login dan registrasi user.
API ini akan melakukan hashing password menggunakan bcrypt dan mengembalikan JWT token.
Task ini bergantung penuh pada tabel `users` dari task #002.

## 📝 Sub-Tasks Breakdown

- [ ] Buat API Endpoint `/api/auth/register` untuk pendaftaran user baru
      *Verification:* Lakukan POST request menggunakan curl ke `/api/auth/register` dan pastikan mengembalikan status 201.

- [ ] Buat API Endpoint `/api/auth/login` untuk autentikasi user
      *Verification:* Kirim login request dan pastikan menerima response JWT token.

## 📎 Referenced Files

- `src/controllers/auth.controller.ts`
- `src/routes/auth.routes.ts`

## 💬 Notes

Status saat ini BLOCKED menunggu skema database di task #002 selesai di-deploy.
