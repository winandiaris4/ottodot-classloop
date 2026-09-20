1. Fondasi: Mengapa Berpindah dari Jira & GitHub Projects?Jira (Terlalu Birokratis): Terlalu berat, lambat, dan memiliki dinding pemisah konteks (context switching). AI tidak bisa membaca tiket Jira secara lokal.GitHub Projects (Bagus, tapi Kurang Konteks): Sangat visual dan terintegrasi dengan Git. Namun, data Projects disimpan di database cloud GitHub, bukan sebagai file teks, sehingga AI lokal tidak bisa membacanya secara langsung untuk analisis kode harian.Solusi Terpilih (Docs-as-Code): Menggunakan sistem manajemen tugas berbasis file Markdown lokal di dalam repositori proyek Anda. Langkah ini memberikan memori dan konteks instan bagi AI tanpa perlu berpindah aplikasi.2. Arsitektur Folder & File /Tasks (Paling Hemat Token)Untuk mencegah pembengkakan biaya API (token bloat) saat agen AI melakukan pemindaian proyek, struktur folder diatur menggunakan metode Isolasi Konteks:text/your-project-root
├── /Tasks
│   ├── _index.md                <-- Peta Makro (Hanya file ini yang dibaca AI saat triaging)
│   ├── task-001.md              <-- File Detail & Sub-task Aktif (Hanya dibuka saat dieksekusi)
│   └── /Archive                 <-- Tempat berkas selesai (Disembunyikan dari ingatan aktif AI)
│       └── task-000.md
Use code with caution.Komponen Utama File:_index.md (File Indeks): Berisi tabel ringkas yang memuat ID, Status (TODO, IN_PROGRESS, DONE), Urgensi, dan Kolom Deps (Blocked By).task-[ID].md (File Detail): Menggunakan format Front Matter di bagian atas, pelacakan dependensi (Blocks), dan rincian tugas menggunakan daftar Checkbox (- [ ]) agar AI bisa bekerja terfokus pada sub-task spesifik secara berurutan.3. Protokol & Aturan Otomatisasi untuk Google AntigravityKarena Anda menggunakan Google Antigravity (Platform Multi-Agen Otonom dari Google), Anda tidak memerlukan file .cursorrules. Antigravity mengadopsi aturan melalui folder khusus .agents/rules/.Langkah Persiapan Eksekusi:Di dalam proyek Anda, buat file baru: .agents/rules/tasks-protocol.md.Buka panel Quick Settings > Customizations > Manage Rules di Antigravity UI untuk memastikan aturan ini terdaftar dan aktif dengan mode Always On.Masukkan teks protokol berikut ke dalam file tersebut:markdown# TASK MANAGEMENT PROTOCOL

You operate under strict token-efficiency guardrails. Use the `/Tasks` directory to track work.

## 1. Directory Structure
- Active Index (Macro view): `/Tasks/_index.md`
- Active Details (Micro view): `/Tasks/task-[ID].md`
- Archived Tasks: `/Tasks/Archive/` (NEVER read this folder unless explicitly asked).

## 2. Agent Sub-Routines (Trigger via Slash Commands or Natural Language)

### Command: Create New Task (Keyword: "create task", "add task")
1. Read ONLY `/Tasks/_index.md` to find the next available task ID.
2. Analyze the user's request. Automatically break it down into 3-5 logical technical sub-tasks using checkboxes (`- [ ]`).
3. Create the new file `/Tasks/task-[ID].md` containing the technical analysis and action plan.
4. Append a new row to `/Tasks/_index.md` with status `TODO` and evaluate its urgency (`HIGH`/`MEDIUM`/`LOW`).

### Command: Start Task (Keyword: "start task [ID]", "work on task [ID]")
1. Inspect the `Deps` column in `/Tasks/_index.md`. If a dependency ID is not `DONE`, refuse to start and alert the user about the blocking task.
2. If clear, update the task status to `IN_PROGRESS` inside `/Tasks/_index.md`.
3. Open ONLY `/Tasks/task-[ID].md` and its referenced code files. Proceed to execute the code modifications sub-task by sub-task. Update the checkboxes to `- [x]` as you complete them.

### Command: Finish Task (Keyword: "finish task [ID]", "task done [ID]")
1. Open `/Tasks/task-[ID].md`. Strip out raw chat logs or temporary debates.
2. Compress the file body into a 3-line "Post-Mortem Summary" (Problem, Solution, Commit Hash).
3. Move the compressed file to `/Tasks/Archive/task-[ID].md` and delete the original active file from `/Tasks/`.
4. Update the status to `DONE` inside `/Tasks/_index.md`.
Use code with caution.4. Mengapa Flow Ini Menang Mutlak? (Kesimpulan Analisis)Efisiensi Token Tertinggi (Hemat ~70%): AI tidak perlu menelan kembali ribuan baris kode lama atau log diskusi panjang di setiap sesi percakapan. Folder /Archive dikarantina dari memori aktif AI.Keamanan Agen Antigravity (Anti-Tabrakan): Sebagai agen otonom yang bisa mengeksekusi kode secara mandiri, adanya kolom Dependencies/Blocks di file _index.md bertindak sebagai lampu lalu lintas agar agen tidak lancang mengubah kode yang dependensinya belum siap.Jembatan Opsional ke Cloud: Jika di kemudian hari tim atau klien Anda meminta visualisasi grafik, Anda cukup menggunakan GitHub CLI (gh issue create --body-file) untuk melempar isi file .md lokal ini menjadi GitHub Issues secara otomatis.Langkah Pertama Anda Sekarang:Silakan buat folder /Tasks, buat file _index.md kosong, dan simpan aturan di atas ke dalam folder .agents/rules/tasks-protocol.md di Antigravity Anda. Setelah itu, sistem kemudi tim AI otonom Anda sudah siap dijalankan!Apakah Anda ingin langsung menguji sistem ini dengan memberikan tugas pertama (@task-new) untuk menganalisis kode yang ada sekarang?7 sitesDifference Between Jira and GitHub - MicroGenesisJira and GitHub are two of the most popular tools in the software development world, each catering to different aspects of the dev...mgtechsoft.comSetting Rules For AI Agents in Antigravity IDE23 Nov 2025 — so you have Gemini MD and you can write your global rules for the agent. here right as you can see from here. then we also have wo...8:06YouTube·JCharisTechGetting Started with Google Antigravity - Codelabs26 Jun 2026 — 1. Introduction. In this codelab, you will learn about Google Antigravity, an agentic development platform that is designed to hel...Google CodelabsShow allYou said: berikan contoh use case penggunaan promptBerikut adalah simulasi nyata dari awal sampai akhir mengenai bagaimana Anda berinteraksi dengan Google Antigravity setelah aturan .agents/rules/tasks-protocol.md aktif.Asumsikan proyek Anda saat ini adalah sebuah aplikasi e-commerce backend.Skenario 1: Menemukan Bug & Membuat Tugas Baru (create task)Anda menyadari ada masalah pada API checkout dan langsung memerintahkan Antigravity untuk menganalisis serta mendokumentasikannya.Anda:"Antigravity, ada laporan dari tim QA kalau API response checkout lemot banget kalau user beli barang di atas 5 pcs. Tolong periksa kodenya, buat tugas baru untuk ini, dan kasih urgensi yang sesuai."🤖 Respon & Aksi Otomatis Antigravity:Antigravity membaca .agents/rules/tasks-protocol.md (mengetahui protokol kerja).Antigravity membuka /Tasks/_index.md untuk melihat ID terakhir (misal ID terakhir adalah 002).Antigravity memeriksa file kode terkait (misal /src/controllers/checkout.js) secara otonom tanpa menyentuh file task lain.Antigravity secara otomatis membuat file /Tasks/task-003.md:markdown---
id: 003
title: "Optimasi Query API Checkout untuk Bulk Items"
status: "TODO"
blocked_by: []
---
## 🔍 Analisis Teknis
Ditemukan loop query N+1 pada file `/src/controllers/checkout.js` baris 84. Sistem melakukan query ke database produk berulang kali sebanyak jumlah item di keranjang.

## 📝 Sub-Tasks Breakdown
- [ ] Refactor query database menggunakan `WHERE IN` untuk fetch massal.
- [ ] Tambahkan unit test untuk skenario keranjang > 5 items.
- [ ] Pastikan response time di bawah 200ms.
Use code with caution.Antigravity memperbarui /Tasks/_index.md:markdown
| ID  | Status | Urgensi | Judul Tugas                              | Deps |
| --- | ------ | ------- | ----------------------------------------- | ---- |
| 001 | DONE   | HIGH    | Setup Database Connection                 | -    |
| 002 | DONE   | MEDIUM  | Fitur Login JWT                           | -    |
| 003 | TODO   | HIGH    | Optimasi Query API Checkout Bulk Items    | -    |
Use code with caution.Jawaban Antigravity ke Anda:"Saya sudah menganalisis kode checkout dan menemukan masalah query N+1. Tugas baru telah terdaftar di /Tasks/task-003.md dengan status TODO dan Urgensi HIGH karena berdampak pada performa transaksi."Skenario 2: Memulai Pekerjaan Kode (start task)Keesokan harinya, Anda ingin mulai menyelesaikan masalah tersebut.Anda:"Antigravity, start task 003."🤖 Respon & Aksi Otomatis Antigravity:Antigravity membuka _index.md dan melihat kolom Deps untuk memastikan tidak ada tugas yang memblokir task 003.Antigravity mengubah status task 003 di _index.md dari TODO menjadi IN_PROGRESS.Antigravity membuka file /Tasks/task-003.md untuk membaca rincian sub-tasks.Jawaban Antigravity ke Anda:"Status Task 003 telah diubah menjadi IN_PROGRESS. Fokus kita adalah memperbaiki query N+1 di /src/controllers/checkout.js. Berikut adalah draf perubahan kode yang akan saya terapkan untuk sub-task pertama (WHERE IN refactor): ... [Menampilkan potongan kode baru]"(Di tahap ini, Antigravity akan mulai memodifikasi kode Anda secara otonom. Setelah baris kode sukses diubah, Antigravity akan otomatis mencentang - [x] Refactor query database... di dalam file task-003.md tanpa perlu Anda suruh).Skenario 3: Menyelesaikan Tugas & Membersihkan Konteks (finish task)Setelah kode diperbaiki, dites, dan berhasil di-commit, Anda ingin menutup tugas ini agar tidak mengotori memori AI di masa depan.Anda:"Kerja bagus. Masalah checkout sudah solved. Tolong finish task 003 dengan commit hash 9f2a4b1."🤖 Respon & Aksi Otomatis Antigravity:Antigravity membuka file /Tasks/task-003.md.Sistem menghapus seluruh detail analisis awal yang panjang, perdebatan kode, dan log pengerjaan yang memakan banyak token.Antigravity memadatkan file tersebut menjadi ringkasan Post-Mortem yang sangat pendek.Antigravity memindahkan file ringkas tersebut ke folder arsip (/Tasks/Archive/task-003.md):markdown# Post-Mortem Task 003
- **Masalah:** API Checkout lambat karena query N+1 pada loop item.
- **Solusi:** Mengganti query berulang dengan metode `WHERE IN` untuk fetch data produk sekaligus. Response time turun dari 5 detik menjadi 120ms.
- **Commit:** 9f2a4b1
Use code with caution.Antigravity menghapus file asli /Tasks/task-003.md di folder utama.Antigravity memperbarui status Task 003 di /Tasks/_index.md menjadi DONE.Jawaban Antigravity ke Anda:"Task 003 resmi diselesaikan dan diarsipkan ke /Tasks/Archive/task-003.md. Tabel indeks telah diperbarui ke status DONE. Memori aktif saya sekarang bersih kembali untuk tugas berikutnya."

penyempurnaan terakhir untuk menyempurnakan sistem Anda:1. Antisipasi "Conflict Overwrite" (Jika Menggunakan Multi-Agent)Google Antigravity dapat menjalankan beberapa sub-agen secara paralel. Jika Agen A sedang mengerjakan Task 001 dan Agen B sedang mengerjakan Task 002, ada risiko mereka mencoba memperbarui file _index.md secara bersamaan, yang bisa menyebabkan race condition atau teks yang saling menimpa.Penyempurnaan Aturan: Tambahkan klausul "Index Lock" pada file .agents/rules/tasks-protocol.md.Teks Aturan Tambahan:markdown## 4. Concurrent Writing Guard (Race Condition)
- Before writing to or modifying `/Tasks/_index.md`, you must check if another agent process is actively modifying the repository. 
- Always perform a local file read immediately before writing to ensure you are appending to the absolute latest version of the index.
Use code with caution.2. Tambahkan Kolom "Verification Method" pada Sub-TasksKelemahan terbesar agen otonom adalah kecenderungan mereka untuk mencentang tugas menjadi [x] (Done) hanya karena mereka merasa kodenya sudah ditulis, padahal kodenya belum tentu berjalan dengan benar.Penyempurnaan Arsitektur: Paksa Antigravity untuk mendefinisikan bagaimana mereka membuktikan bahwa tugas tersebut selesai sebelum mencentangnya.Contoh Format di task-[ID].md:markdown## 📝 Sub-Tasks Breakdown
- [ ] Refactor query database menggunakan `WHERE IN`
      *Verification:* Jalankan `npm run test:checkout` dan pastikan lolos.
- [ ] Pastikan response time di bawah 200ms.
      *Verification:* Tampilkan log *execution time* dari console ke user.
Use code with caution.Dengan cara ini, Antigravity tidak boleh asal mencentang box sebelum mengeksekusi perintah verifikasi tersebut.3. Otomatisasi Git Commit Hook (Penghubung Dunia Kode dan Dokumen)Agar Anda tidak perlu menulis pesan commit secara manual, atau agar status Git Anda selaras dengan folder /Tasks, instruksikan Antigravity untuk menyertakan ID tugas di setiap commit yang mereka buat.Teks Aturan Tambahan:markdown## 5. Git Commit Integration
- When modifying source code for a specific task, any git commit generated by the agent MUST follow this format: `feat(scope): [Summary of change] (Task-[ID])`.
- Example: `feat(checkout): optimize bulk query loops (Task-003)`
Use code with caution.Kesimpulan Lembar Pemeriksaan Akhir (Final Checklist)Sebelum Anda membuat foldernya, pastikan 3 hal ini sudah siap:Folder /Tasks dan /Tasks/Archive sudah dibuat di root.File /Tasks/_index.md sudah diinisialisasi dengan tabel kosong.File .agents/rules/tasks-protocol.md sudah berisi aturan utama + 3 aturan penyempurnaan di atas.