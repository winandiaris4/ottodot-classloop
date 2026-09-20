# 🖥️ DAC Dashboard & Project Scanner

Dashboard lokal berbasis web yang dirancang khusus untuk memvisualisasikan data dari workflow **Document-as-Code (DAC)** secara real-time.

---

## 🚀 Cara Menjalankan

1. Masuk ke direktori dashboard:
   ```bash
   cd dashboard
   ```

2. Buat virtual environment (jika belum ada) dan install requirements:
   ```bash
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   ```

3. Jalankan server:
   ```bash
   .venv/bin/uvicorn main:app --reload --port 3737
   ```

4. Buka browser dan akses:
   **[http://localhost:3737](http://localhost:3737)**

---

## ⚙️ Fitur Utama

### 1. Kanban Board
- Memvisualisasikan task aktif yang berada di folder `/Tasks` ke dalam 4 kolom: `TODO`, `IN_PROGRESS`, `BLOCKED`, dan `DONE`.
- Setiap kartu task menampilkan ID, Judul, Kategori, tingkat Urgensi, dan progress checklist.

### 2. Layout Modal Dua Kolom (Lebar)
- Klik pada task card untuk membuka panel detail.
- **Kolom Kiri**: Menampilkan **Analisis Teknis** dan **Notes** lengkap yang diambil langsung dari file markdown.
- **Kolom Kanan**: Menampilkan **Referenced Files**, dependensi (**Blocked By / Blocks**), progress bar, serta checklist sub-task beserta metode verifikasinya.

### 3. Dependency Graph
- Membuat peta relasi grafis antar-task menggunakan SVG berdasarkan field `blocked_by` di front matter task.
- Menunjukkan alur pengerjaan tugas secara visual.

### 4. Real-time Auto Refresh
- Frontend melakukan polling data ke server lokal setiap 10 detik. Perubahan apa pun pada file markdown (`Tasks/task-*.md`) atau `Specs/brief.md` akan langsung ter-update di layar tanpa perlu refresh manual.

---

## 🔍 Project Scanner (`scanner.py`)

Script detektor otomatis yang memetakan file-file kode asli untuk diisi ke bagian awal `Specs/brief.md`.

- **Melihat Preview Hasil Scan**:
   ```bash
   python dashboard/scanner.py
   ```

- **Menerapkan Hasil Scan ke `brief.md`**:
   ```bash
   python dashboard/scanner.py --write
   ```

---

## 🗂️ Struktur File
- `main.py`: Web server menggunakan FastAPI + Uvicorn.
- `parsers.py`: Parser Markdown python untuk membaca metadata Specs dan Tasks.
- `scanner.py`: Script utilitas scanning struktur proyek dan regex.
- `index.html`: Client dashboard berbasis vanilla JS + CSS Grid.
