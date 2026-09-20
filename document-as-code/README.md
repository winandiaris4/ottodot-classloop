# ⬡ Document-as-Code (DAC) Skeleton

DAC adalah **metodologi kerja dan arsitektur file** untuk mengelola pengerjaan proyek software kolaboratif antara **Manusia (Developer) dan AI Agent** (seperti Google Antigravity, Claude Code, Aider, atau Cursor). 

Dengan memperlakukan manajemen tugas sebagai kode (berkas teks Markdown `.md` di dalam repositori), AI dapat memahami prioritas, dependensi, dan batasan konteks pengerjaan proyek tanpa kehilangan memori history atau mengalami *token bloat*.

---

## ✨ Fitur Utama

- **Strict Task Token Isolation**: Memisahkan pengerjaan aktif dari tugas lama yang sudah diarsipkan, menghemat token API hingga ~70%.
- **Dependency Flow Blockers**: Mengunci tugas agar tidak dikerjakan AI jika tugas prasyarat (`blocked_by`) belum selesai.
- **Interactive Local Dashboard**: Kanban Board, visualisasi grafis alur dependensi (Dependency Graph), backlog ide, dan visualisasi arsip (Post-Mortem).
- **Auto Project Scanner**: Script otomatis untuk mendeteksi stack teknologi, test framework, config, dan entry point dari proyek target.
- **Git Commit Auto-Link**: Format pesan commit terstandarisasi yang otomatis mengaitkan kode dengan ID task aktif.

---

## 🚀 Cara Menggunakan (Quick Install)

Jalankan perintah berikut di **root direktori proyek Git Anda** untuk memasang DAC secara instan ke dalam subfolder `dac/`:

```bash
curl -s https://raw.githubusercontent.com/winamus/document-as-code/main/install.sh | bash
```

---

## 📂 Struktur Folder DAC

Setelah diinstal, struktur folder berikut akan terbentuk di dalam subfolder `dac/` proyek Anda:

```text
/dac
  ├── Specs/                       # BARU: Direktori Spesifikasi & Desain Sistem
  │     ├── _index.md              # Index dokumen spesifikasi (AI membaca ini dulu)
  │     ├── brief.md               # Konfigurasi folder kode & stack teknologi
  │     ├── vision.md              # Fase 0: Problem, Target User, MVP Scope
  │     └── architecture.md        # Fase 1: Desain Arsitektur, ERD, API Contract
  ├── PROMPT_GUIDE.md              # Cheatsheet contekkan prompt instruksi AI
  ├── .agents/
  │     └── rules/
  │           └── tasks-protocol.md # Aturan sistem yang wajib dipatuhi AI Agent
  ├── Tasks/
  │     ├── _index.md              # Index makro status tugas aktif & backlog ide
  │     ├── task-001.md            # Detail mikro tugas aktif (Sub-tasks & Verifikasi)
  │     └── Archive/               # Arsip tugas selesai (DONE) untuk efisiensi token
  └── dashboard/                   # Web Dashboard Lokal (FastAPI)
```

---

## ⚙️ Menjalankan Local Web Dashboard

Dashboard visualizer lokal mendukung Kanban Board, Dependency Graph, visualisasi interaktif specs dengan parsing **Mermaid.js**, backlog, dan Prompt Guide yang terintegrasi.

### 🛠️ Menggunakan Skrip Utilitas Pembantu (Rekomendasi)

DAC menyertakan skrip utilitas `dac.sh` di dalam folder pengerjaan proyek Anda untuk memudahkan instalasi dan eksekusi workflow umum.

> 💡 **Penting**: Jalankan skrip ini menggunakan `./dac/dac.sh` (jangan menggunakan `sh dac.sh` karena memerlukan fungsionalitas shell Bash).

Daftar perintah yang didukung:

*   **Setup Virtual Environment**:
    ```bash
    ./dac/dac.sh setup
    ```
    *Membuat virtual environment Python di `dac/dashboard/.venv` dan memasang semua pustaka dependensi.*

*   **Menjalankan Dashboard**:
    ```bash
    ./dac/dac.sh start
    ```
    *Menjalankan server FastAPI di port 3737. Secara otomatis akan menjalankan setup jika virtual environment belum terbentuk.*

*   **Melakukan Scan Proyek**:
    ```bash
    ./dac/dac.sh scan
    ```
    *Mendeteksi stack teknologi, test framework, config, dan entry point dari proyek target.*

*   **Menulis Hasil Scan ke Specs**:
    ```bash
    ./dac/dac.sh scan-write
    ```
    *Mendeteksi dan memperbarui file `dac/Specs/brief.md` secara otomatis.*

---

### 🔧 Menjalankan secara Manual (Alternatif)

Jika Anda ingin menjalankan langkah-langkah secara manual tanpa skrip pembantu:

```bash
# Pindah ke direktori dashboard
cd dac/dashboard

# Membuat virtual environment & pasang dependensi
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Menjalankan server FastAPI/Uvicorn
.venv/bin/uvicorn main:app --reload --port 3737
```

Buka **`http://localhost:3737`** di browser Anda.

---

## 🤖 Menghubungkan ke AI Agent (Cursor / Claude Code / AGY)

Saat memulai sesi kerja baru, arahkan AI Agent Anda untuk memahami konteks dan aturan kerja proyek dengan memberikan petunjuk:

> *"Baca berkas `dac/.agents/rules/tasks-protocol.md` untuk orientasi aturan pengerjaan tugas proyek. Orientasi spesifikasi sistem dapat Anda mulai dengan membaca berkas index `dac/Specs/_index.md`."*

---

## 📖 Alur Kerja & Skema Use Case Nyata

Metodologi DAC membagi siklus pengembangan (development lifecycle) menjadi **4 Tahapan Utama**:

```
[ Spesifikasi (Specs/) ] ──► [ Breakdown Tugas (Tasks/) ] ──► [ Eksekusi & Uji ] ──► [ Post-Mortem (Archive/) ]
```

### 1. Skenario: Menambahkan Fitur Baru (Contoh: "Auth OTP WhatsApp")

#### **Fase 1: Pendefinisian Spesifikasi (Human/AI)**
Anda memiliki ide fitur baru dari luar (misal coretan whiteboard atau Notion PRD). Anda cukup membuat satu file baru di folder `/Specs`:
1. Buat berkas `dac/Specs/auth-otp-whatsapp.md`.
2. Isi dokumen tersebut dengan target fungsionalitas, integrasi API gateway WhatsApp, dan ERD tabel token OTP.
3. Daftarkan dokumen baru ini di `dac/Specs/_index.md`.

#### **Fase 2: Breakdown Tugas Secara Otomatis (AI)**
Buka AI Agent Anda (misal Cursor / Claude) dan ketik prompt:
> *"Berdasarkan Specs/auth-otp-whatsapp.md, breakdown pengerjaan fitur ini menjadi task-task aktif."*

**Yang dilakukan AI**:
- Membaca `dac/Specs/auth-otp-whatsapp.md`.
- Membaca `dac/Tasks/_index.md` untuk melihat ID task terakhir yang tersedia.
- Membuat berkas task baru di `dac/Tasks/` (misalnya `task-004.md` untuk backend API, dan `task-005.md` untuk frontend UI form OTP).
- Mendaftarkan kedua task baru tersebut ke tabel `Active Tasks` di `dac/Tasks/_index.md`.

#### **Fase 3: Eksekusi Task (AI)**
Saat Anda siap memulai pengodean untuk backend, berikan instruksi kepada AI:
> *"Tolong kerjakan task-004."*

**Yang dilakukan AI**:
- Membaca deskripsi detail, dependencies, dan sub-tasks di dalam `dac/Tasks/task-004.md` (dan **hanya** memuat berkas ini, menghemat token context).
- Menulis kode backend sesuai spesifikasi.
- Menjalankan pengujian (Verification).
- Menandai checklist sub-task yang selesai dengan `[x]`.

#### **Fase 4: Code Review & Pengarsipan (Human/AI)**
Setelah semua sub-task di `task-004.md` selesai dan lolos pengujian:
1. AI (atau Anda) akan mengubah status `task-004.md` di front matter menjadi `status: DONE`.
2. Sesuai aturan protokol, berkas `task-004.md` dipindahkan ke folder `dac/Tasks/Archive/task-004.md` untuk menjaga ruang kerja tetap bersih.
3. Tulis ringkasan Post-Mortem sederhana (Masalah yang ditemui, Solusi, dan Commit ID hash) di bagian bawah file untuk referensi masa depan.
4. Perbarui baris tabel di `dac/Tasks/_index.md`.

---

## 📜 Lisensi

[MIT License](LICENSE)
