# 💬 Prompt Cheatsheet — Task Management System

> Simpan file ini sebagai referensi cepat. Semua prompt di bawah sudah dioptimasi
> untuk bekerja dengan protokol `.agents/rules/tasks-protocol.md`.

---

## 🤖 Integrasi dengan Berbagai AI Assistant

DAC bersifat **platform-agnostic** dan dapat digunakan oleh berbagai AI Coding Assistant:

### 1. Cursor IDE (Composer / Chat)
*   **Otomatis (`.cursorrules`)**: Salin konten dari `.agents/rules/tasks-protocol.md` ke file `.cursorrules` di root proyek Anda.
*   **Manual**: Referensikan file aturan saat chat: `Ikuti aturan di @tasks-protocol.md dan update @_index.md`.

### 2. Claude Code (CLI)
*   Muat aturan di awal sesi: `/read-file dac/.agents/rules/tasks-protocol.md`.
*   Instruksikan Claude untuk mematuhi protokol tersebut selama pengerjaan.

### 3. Aider (CLI)
*   Tambahkan file protokol ke daftar pantauan Aider:
    ```bash
    aider dac/.agents/rules/tasks-protocol.md dac/Tasks/_index.md
    ```
*   Instruksikan Aider: `Rujuk berkas tasks-protocol.md sebagai panduan alur kerja pengerjaan kita.`

### 4. Windsurf / Cascade
*   Salin konten `.agents/rules/tasks-protocol.md` ke file `.windsurfrules` di root proyek Anda agar Cascade otomatis mematuhi protokol.

---

## 🏗️ PROJECT PLANNING — Breakdown Proyek Baru

Gunakan ini saat memulai proyek baru atau fitur besar yang butuh dipecah dulu
sebelum dikerjakan. **Jangan langsung `create task` satu per satu** — biarkan AI
memetakan dependensi secara menyeluruh terlebih dahulu.

### Template Prompt Project Brief

```
Aku ingin membuat [nama proyek / fitur besar].

Deskripsi: [jelaskan tujuan dan konteks proyek]
Stack: [teknologi yang digunakan]
Target selesai: [estimasi waktu, misal: 2 minggu]

Fitur / scope yang dibutuhkan:
1. [Fitur A — deskripsi singkat]
2. [Fitur B — deskripsi singkat]
3. [Fitur C — deskripsi singkat]

Tolong:
1. Breakdown menjadi task-task teknis yang logis
2. Perhatikan urutan dependensi (mana yang harus selesai duluan)
3. Create semua task-nya sekaligus ke dalam /Tasks
4. Update _index.md dengan seluruh task beserta deps-nya
```

**Contoh nyata:**

```
Aku ingin membuat sistem autentikasi untuk aplikasi DAC.

Deskripsi: User harus bisa register, login, dan memiliki session yang persistent.
Stack: Next.js 14, Supabase Auth, Prisma ORM
Target selesai: 1 minggu

Fitur / scope:
1. Setup Supabase project dan konfigurasi environment
2. Schema database untuk tabel users dan sessions
3. API endpoint register dan login
4. Middleware proteksi route
5. UI halaman login dan register
6. Testing end-to-end flow autentikasi

Tolong breakdown menjadi task teknis, perhatikan dependensinya,
lalu create semua task sekaligus.
```

> **Yang AI akan lakukan secara otomatis:**
> - Mengelompokkan fitur ke urutan logis (setup dulu, baru fitur, baru UI, baru testing)
> - Mengisi `blocked_by` dan `blocks` antar task secara tepat
> - Membuat semua `task-[ID].md` sekaligus
> - Mengupdate `_index.md` dengan dependency chain yang lengkap

### Urutan Dependensi Umum (Panduan AI & Manusia)

```
[Setup & Config] → [Database / Schema] → [Backend / API] → [Frontend / UI] → [Testing]
```

Jangan pernah membuat task Frontend sebelum task Backend selesai,
dan jangan Backend sebelum Schema selesai.

### Setelah Project Brief Dibuat — Mulai Eksekusi

```
tampilkan semua task hasil breakdown tadi beserta dependency chain-nya
```

```
task mana yang bisa dimulai sekarang? (tidak ada yang memblokir)
```

```
start task [ID task pertama yang tidak punya deps]
```

---

## 🆕 CREATE TASK

Gunakan saat menemukan bug, ingin fitur baru, atau ada pekerjaan teknis yang perlu didokumentasikan.

```
create task: [deskripsi singkat masalah atau fitur]
```

**Contoh prompt efektif:**

```
create task: API /checkout lambat saat user membeli lebih dari 5 item sekaligus,
kemungkinan ada N+1 query di controller checkout. Urgensi HIGH.
```

```
create task: Tambahkan fitur export laporan ke format PDF di halaman dashboard admin.
Ini bergantung pada task 003 yang sedang IN_PROGRESS.
```

```
create task: Refactor komponen <UserCard> menjadi reusable, sekarang ada 4 tempat
yang copy-paste kode yang sama. Urgensi LOW.
```

> **Tips**: Sertakan konteks sebanyak mungkin di satu prompt — nama file, dugaan penyebab,
> dan urgensi. AI akan otomatis memecahnya menjadi sub-tasks.

### Skenario: Menambahkan Fitur Baru dari Existing System
Ketika menambahkan fitur pada sistem yang sudah berjalan, arahkan AI untuk **menganalisis struktur kode yang sudah ada** terlebih dahulu agar konsisten dengan arsitektur saat ini dan menghindari duplikasi kode.

**Template Prompt:**
```
create task: Tambahkan fitur [nama fitur] pada sistem yang sudah ada.

Konteks Kode Saat Ini:
- Fitur ini akan berinteraksi dengan: [sebutkan file/komponen/tabel database yang sudah ada]
- Struktur yang harus diikuti: [sebutkan file referensi yang polanya mirip, misal: ikuti pola API di src/controllers/user.controller.ts]

Langkah Analisis:
1. Analisis file [sebutkan file target] untuk memahami cara kerja fitur saat ini.
2. Identifikasi dampak perubahan (dampak ke API lain, relasi database, dsb.).
3. Rancang sub-tasks tanpa merusak kode/flow yang sudah berjalan.
```

**Contoh Nyata:**
```
create task: Tambahkan fitur "Kirim OTP via WhatsApp" saat User Register.

Konteks Kode Saat Ini:
- Flow register saat ini ada di `src/services/auth.service.ts` (sudah ada kirim OTP via Email).
- Kita sudah punya modul WhatsApp di `src/libs/whatsapp.ts`.

Tolong:
1. Analisis flow register saat ini agar OTP WhatsApp dikirim secara paralel dengan OTP Email.
2. Pecah pengerjaan menjadi 2 task terpisah:
   - Task 1: Integrasi Whatsapp Helper di Backend Service (Deps: None)
   - Task 2: Update UI Form Register untuk input nomor Whatsapp (Deps: Task 1)
3. Buat file detail task dan checklist sub-task beserta metode verifikasinya untuk masing-masing.
```

> **Tips**: Jika perubahan melibatkan database, API backend, dan antarmuka UI sekaligus, **selalu perintahkan AI secara eksplisit** untuk memecahnya menjadi beberapa task (`Database`, `Backend`, `Frontend`) terpisah dengan ID berurutan dan dependensi yang sesuai. Ini menjaga file task tetap ramping dan terarah.

### 🛠️ Best Practice: Menambah / Update Service Baru (Existing System)
Ketika Anda ingin membuat service baru (misal: `NotificationService`, `PaymentService`, dsb.) di dalam sistem yang sudah berjalan, gunakan struktur prompt 3-Fase di bawah ini agar AI memecahnya menjadi task-task berurutan dengan dependensi yang logis.

**Template Prompt Terbaik:**
```
create task: Tambahkan service baru [Nama Service] untuk menangani [tanggung jawab service].

1. Analisis Awal (Wajib Baca):
   - Pelajari file existing: [sebutkan direktori/file service yang mirip, misal: src/services/email.service.ts]
   - Gunakan pendekatan arsitektur yang sama (misal: Singleton, Dependency Injection, Interface/Abstract Class).

2. Pembagian Task (Multi-Task Breakdown):
   Pecah menjadi beberapa task aktif berurutan di _index.md:
   - Task A: Database & Modul Config (Urgensi: HIGH, Kategori: Database/Backend)
     -> Buat tabel/schema database pendukung dan file konfigurasi env/key service.
   - Task B: Implementasi Core Service & Unit Tests (Urgensi: HIGH, Kategori: Backend, Deps: Task A)
     -> Buat core class service, methods utama, dan 100% test coverage menggunakan mock.
   - Task C: Integrasi API / Route Endpoint (Urgensi: MEDIUM, Kategori: Backend, Deps: Task B)
     -> Hubungkan service baru ke controller/router API existing.
   - Task D: Integrasi UI / Dashboard Admin (Kategori: Frontend, Deps: Task C)

3. Format Output:
   - Tulis analisis teknis singkat mengenai potensi side-effects (dampak ke service lain).
   - Buat file markdown masing-masing task di folder /Tasks.
   - Di setiap file task, pecah pengerjaan menjadi 3-4 sub-task spesifik lengkap dengan langkah *Verification* yang konkret.
```

---

## 📋 BACKLOG MANAGEMENT

Gunakan ini untuk mencatat ide-ide atau fitur masa depan tanpa membuat file task `.md` aktif. 
Ini mencegah pembengkakan memori AI dan menghemat biaya token API.

### Menambahkan Item Backlog Baru
```
add backlog: [Judul ide / Deskripsi fitur]
```
*   **Contoh**: `add backlog: Integrasi OAuth dengan Google Login. Kategori Frontend. Urgensi LOW.`

### Mempromosikan Backlog ke Task Aktif
Saat siap mengerjakan salah satu backlog, gunakan:
```
promote backlog [ID]
```
*   **Contoh**: `promote backlog B01`
*   *Efek*: AI akan otomatis menghapus item `B01` dari tabel Backlog di `_index.md`, memindahkannya ke tabel Active Tasks sebagai `task-004.md`, lalu men-generate file detail task dan checklist sub-task untuk Anda.

---

## ▶️ START TASK

Gunakan saat siap mengerjakan task. AI akan cek dependensi sebelum mulai.

```
start task [ID]
```

**Contoh:**

```
start task 003
```

```
mulai task 005, fokus ke sub-task pertama dulu
```

> **Tips**: Tambahkan instruksi fokus jika task besar — AI akan mengerjakan
> hanya sub-task yang kamu tentukan, bukan semuanya sekaligus.

---

## ✅ FINISH TASK

Gunakan setelah kode di-commit dan sudah dites. Sertakan commit hash.

```
finish task [ID] dengan commit hash [HASH]
```

**Contoh:**

```
finish task 003 dengan commit hash 9f2a4b1
```

```
task done 005, commit hash a3c91de, semua test passed
```

> **Tips**: Selalu sertakan commit hash agar Post-Mortem di Archive bisa
> dilacak kembali ke perubahan kode yang spesifik.

---

## 🔍 TRIAGING & STATUS CHECK

Gunakan untuk melihat situasi semua task tanpa membuka file detail.

```
tunjukkan status semua task aktif
```

```
task mana yang bisa dikerjakan sekarang? (cek dependensi yang sudah clear)
```

```
apa yang sedang IN_PROGRESS?
```

```
task mana yang BLOCKED dan kenapa?
```

> **Tips**: AI hanya perlu baca `_index.md` untuk ini — sangat hemat token.
> Jangan minta AI "buka semua task file" saat hanya ingin overview.

---

## 🔄 UPDATE STATUS MANUAL

Gunakan jika ada perubahan kondisi di luar flow normal.

```
update task 004 status menjadi BLOCKED, blocked by task 002
```

```
task 003 ternyata belum bisa dimulai, tandai BLOCKED karena menunggu approval design
```

```
batalkan task 006, tidak jadi dikerjakan
```

```
update task 005 kategori menjadi Backend
```

---

## 🔎 CEK DEPENDENSI

Gunakan sebelum mulai sprint atau planning.

```
task mana saja yang memblokir task 005?
```

```
jika task 002 selesai hari ini, task mana yang bisa langsung dimulai?
```

---

## 📚 CEK ARSIP (Gunakan Hemat-hemat)

> ⚠️ Prompt ini memaksa AI membaca folder Archive — gunakan HANYA jika perlu
> referensi dari task lama. Jangan gunakan rutin karena boros token.

```
lihat arsip task 003, apa solusi yang dipakai waktu itu?
```

```
cari di archive, apakah pernah ada task terkait optimasi database?
```

---

## 🛠️ DEBUGGING & ANALISIS KODE (Dengan Konteks Task)

Sertakan ID task agar AI tahu konteks pekerjaan yang sedang dilakukan.

```
dalam konteks task 004, analisis file /src/services/report.service.ts —
kenapa generate PDF bisa timeout untuk data > 1000 baris?
```

```
lanjutkan task 003, sub-task kedua: tambahkan unit test untuk skenario bulk items.
Jalankan verifikasinya setelah selesai.
```

---

## 📝 FORMAT COMMIT (Digunakan AI Otomatis)

Kamu tidak perlu menulis ini — AI melakukannya otomatis sesuai protokol.
Tapi kalau commit manual, ikuti format ini:

```
feat(scope): [ringkasan perubahan] (Task-[ID])
fix(scope): [ringkasan perubahan] (Task-[ID])
refactor(scope): [ringkasan perubahan] (Task-[ID])
```

**Contoh:**
```
feat(checkout): optimize bulk query with WHERE IN clause (Task-003)
fix(auth): handle JWT expiry on concurrent requests (Task-005)
refactor(ui): extract UserCard into reusable component (Task-007)
```

---

## ⚡ QUICK REFERENCE — Trigger Keywords

| Aksi | Keyword yang Dikenali AI |
|------|--------------------------|
| Buat task baru | `create task`, `add task`, `buat task`, `tambah task` |
| Mulai task | `start task [ID]`, `mulai task [ID]`, `work on task [ID]` |
| Selesaikan task | `finish task [ID]`, `task done [ID]`, `selesaikan task [ID]` |
| Cek semua status | `tunjukkan task aktif`, `status semua task`, `task overview` |
| Cek arsip | `lihat arsip task [ID]`, `cari di archive` |

---

## 🚫 Anti-Pattern — Prompt yang Harus Dihindari

| ❌ Hindari | ✅ Gunakan Sebagai Gantinya |
|---|---|
| "Baca semua file task dan kasih overview" | "Tunjukkan status semua task aktif" (AI cukup baca `_index.md`) |
| "Kerjakan semua task yang belum selesai" | "Start task 003" (satu task, satu fokus) |
| "Lihat semua arsip task" | "Lihat arsip task [ID spesifik]" |
| "Ingat konteks dari kemarin..." | Selalu sebut ID task — konteks ada di file task, bukan di memori AI |
| Memberi brief panjang tanpa `create task` | Awali dengan `create task:` agar terdokumentasi |
