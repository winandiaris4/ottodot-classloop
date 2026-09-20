---
id: "002"
title: "Design Database Schema for Authentication"
status: "TODO"
urgency: "HIGH"
category: "Database"
created_at: "2026-07-02"
blocked_by: []
blocks: ["003"]
---

## 🔍 Analisis Teknis

Sebelum membuat API Endpoint untuk Registrasi dan Login, kita perlu merancang struktur tabel database
terlebih dahulu. Kita akan merancang skema tabel `users` untuk menyimpan kredensial user, salt,
dan metadata lainnya.

## 📝 Sub-Tasks Breakdown

- [ ] Rancang skema tabel `users` menggunakan migration file
      *Verification:* Jalankan `npx prisma migrate dev --name init_users` dan pastikan berhasil.

- [ ] Buat index pada kolom `email` untuk pencarian cepat saat login
      *Verification:* Pastikan field `email` memiliki anotasi `@unique` di `schema.prisma`.

## 📎 Referenced Files

- `src/prisma/schema.prisma`

## 💬 Notes

Task ini harus DONE sebelum task API Login (#003) dapat dimulai.
