# TASK MANAGEMENT PROTOCOL
> **Mode**: Always On
> **Scope**: All tasks and code modifications within this repository.

You operate under strict token-efficiency guardrails. Use the `/Tasks` directory to manage and track all work.

> 📖 **Session Start Rule**: At the beginning of every new session or when project context is unclear,
> read `Specs/_index.md` first to understand what specification documents exist, then open only the relevant spec file.
> Read `BRIEF.md` only if `Specs/` directory does not exist (backward compatibility).

---

## 1. Directory Structure

- **Spec Index (Orientation)**: `Specs/_index.md` — Baca ini di awal sesi. Berisi daftar semua file spesifikasi.
- **Spec Details**: `Specs/[file].md` — Buka HANYA jika user menyebut file tersebut, atau task yang dikerjakan membutuhkan konteks spesifik dari file tersebut. **JANGAN** baca seluruh direktori `Specs/` sekaligus.
- **Active Index (Macro view)**: `/Tasks/_index.md` — Baca ini saat triaging. Berisi ringkasan semua task aktif.
- **Active Details (Micro view)**: `/Tasks/task-[ID].md` — Buka HANYA saat task tersebut akan dieksekusi.
- **Archived Tasks**: `/Tasks/Archive/` — **JANGAN** baca folder ini kecuali user meminta secara eksplisit.
- **Flat Directory Rule**: **JANGAN PERNAH** membuat subdirectory baru di dalam `/Tasks/`. Semua file detail task aktif harus berada langsung di bawah folder `/Tasks/`.
- **Source Directory Rule**: **JANGAN** scan seluruh repository. Gunakan `Source Dir` dari `Specs/brief.md` sebagai root pencarian kode.

---

## 2. Agent Sub-Routines

### Command: Init Brief (Auto-scan Project Structure)
**Trigger**: Keyword "init brief", "scan project", "auto-fill brief", "deteksi struktur proyek".

**Steps**:
1. Jalankan: `python dashboard/scanner.py` dari root proyek.
2. Baca output deteksi: source dir, entry point, config files, test dir, dan stack teknologi.
3. Isi bagian `## 📂 Struktur Folder Kode` dan `## 🛠️ Stack Teknologi` di `Specs/brief.md` menggunakan hasil scan.
4. Jika ada field yang tidak terdeteksi, tandai sebagai `[belum terdeteksi]` dan tanyakan ke user.
5. Jangan mengisi bagian lain (`Nama Proyek`, `Deskripsi`, `Stakeholder`, dsb.) — itu harus diisi oleh user.
6. Perbarui kolom `Terakhir Diperbarui` di `Specs/_index.md` untuk baris `brief.md`.

> Alternatif: `python dashboard/scanner.py --write` untuk langsung update Specs/brief.md tanpa konfirmasi.

---

### Command: Create Tasks from Spec File
**Trigger**: Keyword "berdasarkan Specs/[nama-file]", "based on Specs/[nama-file]", "breakdown [file] menjadi task", atau penyebutan file di dalam folder `Specs/` disertai instruksi untuk membuat task.

**Steps**:
1. Baca file spec yang disebutkan: `Specs/[nama-file].md`.
2. Analisis scope, fitur, dan komponen yang teridentifikasi dalam file tersebut.
3. Tentukan apakah cukup membuat **1 task** atau perlu **multi-task breakdown** (lihat aturan di Command: Create New Task).
4. Baca `Tasks/_index.md` untuk menentukan ID task berikutnya.
5. Buat file task baru di `/Tasks/task-[ID].md`. Tambahkan field `source_spec` di front matter:
   ```yaml
   source_spec: "Specs/[nama-file].md"
   ```
6. Daftarkan semua task baru di tabel `Active Tasks` pada `Tasks/_index.md`.

---

### Command: Add Backlog
**Trigger**: Keyword "add backlog", "tambah backlog", "buat backlog: [deskripsi ide]".

**Steps**:
1. Baca seksi `## 📋 Backlog` di `/Tasks/_index.md` untuk menemukan ID backlog berikutnya (format `B01`, `B02`, dst.).
2. Tambahkan baris baru ke tabel Backlog di `/Tasks/_index.md`. **JANGAN** membuat file `task-[ID].md` untuk item backlog.

---

### Command: Promote Backlog to Active Task
**Trigger**: Keyword "promote backlog [ID]", "promosikan backlog [ID]".

**Steps**:
1. Baca tabel `## 📋 Backlog` di `/Tasks/_index.md` dan ambil data item dengan ID tersebut.
2. Hapus baris item backlog tersebut dari tabel Backlog di `/Tasks/_index.md`.
3. Tentukan ID task aktif berikutnya (misal `004`).
4. Buat file baru `/Tasks/task-[ID].md` dan pecah keterangannya menjadi 3-5 sub-tasks dengan verifikasi.
5. Tambahkan baris baru ke tabel `## Active Tasks` di `/Tasks/_index.md` dengan status `TODO`.

---

### Command: Create New Task
**Trigger**: Keyword "create task", "add task", "buat task", "tambah task", atau permintaan fitur/bug baru.

**Steps**:
1. Evaluasi cakupan (scope) permintaan user:
   - **Tugas Kecil / Spesifik** (misal: "tambah field user", "fix bug auth") → Buat **1 task** dengan 3-5 sub-task.
   - **Fitur Baru / Kompleks** (misal: "tambah fitur OTP WhatsApp", "tambah payment gateway") → Pecah menjadi **beberapa task** terpisah (misal: `Database Schema`, `Backend API`, dan `Frontend UI`) dengan dependensi `blocked_by` yang saling menghubungkan.
2. Baca `/Tasks/_index.md` untuk menemukan ID terakhir yang tersedia.
3. Buat file task baru `/Tasks/task-[ID].md` untuk setiap task hasil breakdown.
4. Setiap sub-task di dalam file task **wajib** memiliki baris `*Verification:*` yang menjelaskan cara verifikasi yang valid (perintah console/test script).
5. Tentukan `category` yang tepat untuk masing-masing task.
6. Daftarkan semua task yang baru dibuat ke tabel di `/Tasks/_index.md` dengan status `TODO` (atau `BLOCKED` jika dependensinya terdaftar dan belum DONE).

**Template `/Tasks/task-[ID].md`**:
```markdown
---
id: [ID]
title: "[Judul Task]"
status: "TODO"
urgency: "HIGH|MEDIUM|LOW"
category: "Frontend|Backend|DevOps|Database|Mobile|Other"
created_at: "[YYYY-MM-DD]"
blocked_by: []
blocks: []
---

## 🔍 Analisis Teknis
[Deskripsi teknis masalah atau fitur yang akan dikerjakan]

## 📝 Sub-Tasks Breakdown
- [ ] [Sub-task 1]
      *Verification:* [Cara verifikasi bahwa sub-task ini benar-benar selesai]
- [ ] [Sub-task 2]
      *Verification:* [Cara verifikasi]
- [ ] [Sub-task 3]
      *Verification:* [Cara verifikasi]

## 📎 Referenced Files
- [Daftar file kode yang relevan]

## 💬 Notes
[Catatan tambahan jika ada]
```

---

### Command: Start Task
**Trigger**: Keyword "start task [ID]", "work on task [ID]", "kerjakan task [ID]", "mulai task [ID]".

**Steps**:
1. Buka `/Tasks/_index.md`. Periksa kolom `Deps` untuk task tersebut.
   - Jika ada dependensi yang belum `DONE` → **TOLAK** dan informasikan task yang memblokir kepada user.
   - Jika bersih → lanjut ke langkah berikutnya.
2. Update status task di `/Tasks/_index.md` dari `TODO` menjadi `IN_PROGRESS`.
3. Update field `status` di front matter `/Tasks/task-[ID].md` menjadi `IN_PROGRESS`.
4. Baca `/Tasks/task-[ID].md` dan file kode yang direferensikan.
5. Eksekusi sub-task **satu per satu secara berurutan**.
6. Setelah setiap sub-task selesai:
   - Jalankan perintah verifikasi yang tertera di baris `*Verification:*`.
   - Hanya jika verifikasi lulus → update checkbox dari `- [ ]` menjadi `- [x]`.

---

### Command: Finish Task
**Trigger**: Keyword "finish task [ID]", "task done [ID]", "selesaikan task [ID]", diikuti dengan commit hash.

**Steps**:
1. Buka `/Tasks/task-[ID].md`.
2. Hapus semua detail analisis awal, log perdebatan, dan catatan sementara.
3. Padatkan isi file menjadi format **Post-Mortem ringkas** (3 baris).
4. Pindahkan file yang sudah dikompres ke `/Tasks/Archive/task-[ID].md`.
5. Hapus file asli `/Tasks/task-[ID].md` dari folder utama.
6. Update status task di `/Tasks/_index.md` menjadi `DONE`.

**Template Post-Mortem**:
```markdown
# Post-Mortem Task [ID]
- **Masalah:** [Deskripsi singkat masalah atau fitur]
- **Solusi:** [Apa yang dilakukan dan hasil terukurnya]
- **Commit:** [hash]
```

---

## 3. Status Transitions

```
TODO → IN_PROGRESS → DONE
 └──────── BLOCKED (jika deps belum selesai)
```

Agen **tidak boleh** melompat status. Urutan wajib diikuti.

---

## 4. Concurrent Writing Guard (Race Condition)

> ⚠️ Berlaku saat Antigravity menjalankan beberapa sub-agen secara paralel.

- Sebelum menulis atau memodifikasi `/Tasks/_index.md`, **baca ulang file tersebut terlebih dahulu** untuk memastikan kamu menulis ke versi paling mutakhir.
- Jangan pernah mengoverwrite perubahan agen lain. Selalu **append** atau **merge** baris baru, bukan replace seluruh isi file.
- Jika terdeteksi konflik (baris yang sama dimodifikasi oleh dua agen), **hentikan operasi** dan laporkan ke user untuk resolusi manual.

---

## 5. Git Commit Integration

- Setiap kali agen memodifikasi kode sumber untuk task tertentu, commit Git yang dihasilkan **wajib** mengikuti format berikut:

  ```
  feat(scope): [ringkasan perubahan] (Task-[ID])
  ```

- **Contoh**:
  ```
  feat(checkout): optimize bulk query loops (Task-003)
  fix(auth): resolve JWT expiry edge case (Task-007)
  refactor(api): extract reusable pagination helper (Task-012)
  ```

- Scope diisi dengan nama modul/fitur yang diubah (lowercase, tanpa spasi).
- Agen **tidak boleh** melakukan commit tanpa menyertakan Task ID di akhir pesan commit.

---

## 6. Token Efficiency Rules

- **JANGAN** membaca file di `/Tasks/Archive/` kecuali user meminta secara eksplisit.
- **JANGAN** membaca semua file `task-[ID].md` sekaligus saat triaging — cukup baca `_index.md`.
- **JANGAN** memasukkan log diskusi atau raw chat ke dalam file task.
- Saat mengerjakan task, buka **hanya** file yang direferensikan di section `📎 Referenced Files` pada task tersebut.
