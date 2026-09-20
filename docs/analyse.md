## Analisis Job: Full Stack Software Engineer — Ottodot

### 🏢 Tentang Perusahaan

Ottodot adalah edtech startup yang fokus pada pembelajaran matematika dan sains untuk anak-anak lewat live classes dan game berbasis Roblox (sudah punya 200+ games). Mereka sekarang sedang membangun **platform layer** di atas produk game mereka — artinya perusahaan ini berada di fase **early-to-mid growth**, bukan dari nol, tapi belum matang secara sistem.

---

### 📋 Apa yang Sebenarnya Dicari

Dari cara job desc ditulis, ini bukan sekadar "engineer biasa." Ada beberapa sinyal penting:

**"Founder-built platform" → "reliable product"**
Ini kode untuk: *codebase-nya kemungkinan besar berantakan, belum ada proper architecture, technical debt tinggi.* Kamu akan masuk sebagai orang yang merapikan dan menstabilkan, bukan greenfield.

**"Own technical decisions"**
Mereka butuh orang yang bisa **berpikir sendiri**, bukan menunggu instruksi. Di early-stage startup, ini artinya kamu harus nyaman dengan ambiguitas dan sering jadi satu-satunya pemegang keputusan teknis.

**"Work closely with the founder"**
Struktur tim kemungkinan sangat kecil — bisa jadi kamu adalah engineer pertama atau salah satu dari sedikit. Akses langsung ke founder bisa bagus, tapi juga berarti ekspektasi tinggi dan prioritas bisa berubah cepat.

---

### 🛠️ Stack & Tantangan Teknis

Stack-nya modern dan cukup mainstream:

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind |
| Backend | Next.js API routes / Supabase Edge Functions |
| Database | Supabase (Postgres) |
| Hosting | Vercel |

Ini stack yang **solid untuk startup**, tapi ada beberapa area yang secara eksplisit disebutkan dan perlu kamu kuasai betul:

- **Auth** — Login/account access disebut "perlu distabilkan", artinya ada masalah di sini
- **Permissions** — Multi-role system (student, parent, teacher, admin) cukup kompleks
- **Billing/Enrollment** — Self-serve booking system = integrasi payment, kemungkinan Stripe
- **Data migrations** — Kalau codebase lagi dalam transisi, migrasi Postgres bisa rawan
- **Data integrity** — Homework flows, class data — konsistensi data jadi kritis

---

### ✅ Kelebihan Role Ini

- **Tanggung jawab besar sejak awal** — bagus untuk portofolio dan growth
- **Stack modern** — bukan legacy tech, mudah dicari referensinya
- **Mission yang jelas dan positif** — edtech untuk anak-anak, produknya playful
- **Remote full-time** — fleksibel lokasi
- **Akses langsung ke founder** — belajar banyak soal product thinking dan business

---

### ⚠️ Hal yang Perlu Dicermati

**1. Jam kerja GMT+8 (10am–6pm)**
Ini bukan remote dengan timezone bebas. Mereka fix di Asia timezone — cocok kalau kamu di Indonesia, Malaysia, atau sekitarnya. Tapi perlu konfirmasi apakah ada fleksibilitas.

**2. "Messy real-world codebase"**
Mereka sendiri yang bilang. Kalau kamu tipe yang butuh struktur rapi dari awal, ini bisa frustrasi. Kalau kamu suka problem-solving dan refactoring, ini justru menarik.

**3. Tim sangat kecil**
Tidak ada mention soal tim engineering lain. Kamu mungkin solo atau hampir solo — tidak ada senior yang bisa jadi mentor, support on-call kemungkinan jatuh ke kamu.

**4. Tidak ada info gaji**
Job desc tidak menyebut kompensasi sama sekali. Penting untuk ditanyakan di awal, terutama karena ini full-time dengan jam yang cukup strict.

**5. Early-stage startup risk**
Roblox-based edtech adalah niche yang unik — validasi market-nya perlu dicek. Seberapa besar user base mereka sekarang? Apakah sudah revenue-positive?

---

### 🎯 Cocok untuk Siapa?

Role ini **sangat cocok** kalau kamu:
- Punya 3–5 tahun pengalaman full-stack dan sudah pernah handle production systems
- Nyaman kerja dengan ownership tinggi dan minimal hand-holding
- Suka lingkungan startup yang bergerak cepat
- Peduli dengan edtech / produk untuk anak-anak
- Sudah familiar dengan Supabase atau mau belajar cepat

Role ini **kurang cocok** kalau kamu:
- Masih butuh banyak mentoring atau pair programming rutin
- Prefer codebase yang sudah well-structured
- Butuh kepastian job security jangka panjang (startup risk tetap ada)

---

### 💡 Pertanyaan yang Layak Ditanyakan saat Interview

1. Berapa besar tim engineering sekarang?
2. Apa masalah terbesar yang paling ingin diselesaikan dalam 3 bulan pertama?
3. Bagaimana runway finansial perusahaan saat ini?
4. Seperti apa "messy"-nya codebase — ada dokumentasi? Ada test coverage?
5. Apakah ada ekspektasi on-call atau weekend support?
6. Range kompensasi dan apakah ada equity?

---

**Kesimpulan:** Ini role yang menarik dengan tanggung jawab nyata di startup dengan misi yang genuine. Tapi masuk dengan mata terbuka — kamu akan jadi problem-solver utama di sistem yang belum stabil, dengan tim kecil dan ekspektasi ownership yang tinggi.

## Analisis Pre-Interview Questions Ottodot

Pertanyaan ini bukan formalitas. Setiap pertanyaan dirancang untuk menyaring kandidat secara spesifik. Mari bedah satu per satu.

---

### Q1: "Tell us about a project you led end to end, with limited constraints. What did you cut, what did you protect, and what was the hardest part?"

**Apa yang sebenarnya ditanya:**

Ini bukan pertanyaan tentang project kamu. Ini pertanyaan tentang **judgment** kamu.

Founder ingin tahu:
- Apakah kamu bisa membuat keputusan sendiri tanpa diarahkan?
- Apakah kamu paham apa yang penting vs tidak penting?
- Apakah kamu bisa deliver di kondisi tidak ideal?

Kata kunci yang perlu diperhatikan: **"what did you cut"** — ini yang paling penting. Mereka ingin tahu apakah kamu bisa bilang *tidak* pada fitur yang tidak esensial. Engineer yang tidak bisa cut scope adalah engineer yang selalu telat deliver.

**Jebakan yang harus dihindari:**
- Jawaban yang terlalu teknis ("saya pakai Redis untuk caching...") — mereka tidak tanya soal teknologi
- Jawaban tanpa konflik ("projectnya berjalan lancar") — tidak credible
- Tidak menyebut apa yang di-cut — berarti kamu tidak paham inti pertanyaannya

**Struktur jawaban ideal:**
```
1. Context singkat: project apa, constraint-nya apa (waktu/orang/budget)
2. Apa yang kamu POTONG dan kenapa — ini bagian terpenting
3. Apa yang kamu PERTAHANKAN mati-matian dan kenapa
4. Apa yang paling susah — jujur, bukan jawaban aman
```

**Contoh arah jawaban yang kuat:**
> *"Saya pernah membangun sistem manajemen kelas untuk [X] sendirian dalam 3 minggu. Yang saya cut: notifikasi email, export laporan, dan dark mode — karena tidak ada yang akan block user dari value utama. Yang saya protect: auth yang benar dan data isolation antar user — karena kalau ini salah, trust rusak dan tidak bisa diperbaiki dengan patch cepat. Yang paling susah adalah mengabaikan permintaan fitur di tengah development dan tetap fokus pada yang selesai dulu."*

---

### Q2: "What have you built or automated with AI tools in the last month or two? Share a link if you can."

**Apa yang sebenarnya ditanya:**

Mereka tidak tanya apakah kamu *tahu* AI tools. Mereka tanya apakah kamu **sudah memakainya sebagai leverage kerja nyata.**

Di job desc disebutkan: *"Can work independently, use AI coding agents as leverage"* — ini bukan nice to have, ini requirement.

Mereka ingin engineer yang output-nya berlipat karena pakai AI, bukan yang masih pakai AI hanya untuk autocomplete.

**Yang mereka harap dengar:**
- Kamu pakai Cursor / Claude / Copilot untuk generate boilerplate dan kamu fokus ke logic yang penting
- Kamu build internal tool atau script yang mengotomasi sesuatu
- Kamu punya workflow AI yang konkret, bukan sekadar "saya pakai ChatGPT untuk debugging"

**Jebakan:**
- Jawaban generik: "Saya pakai GitHub Copilot untuk bantu nulis kode" — terlalu lemah
- Tidak bisa share link apapun — kehilangan poin besar
- Overclaim: bilang AI yang bikin semuanya — tidak credible

**Cara memperkuat jawaban ini:**

Kalau belum punya sesuatu yang bisa di-share, bangun sekarang sebelum apply. Bahkan sebuah script sederhana yang di-share di GitHub, atau project kecil yang ada AI feature-nya, sudah jauh lebih baik dari tidak ada sama sekali.

Contoh arah jawaban:
> *"Sebulan terakhir saya pakai Cursor untuk membangun [project] — AI saya pakai untuk generate repetitive code seperti form validation dan API route boilerplate, sementara saya fokus ke bagian yang butuh judgment: schema design, RLS policy, dan error handling logic. Hasilnya saya bisa selesaikan dalam separuh waktu estimasi awal. [link GitHub]"*

---

### Q3: "Why are you interested in this role?"

**Apa yang sebenarnya ditanya:**

Ini pertanyaan yang paling mudah dijawab salah. Sebagian besar kandidat akan menjawab dengan alasan generik yang terdengar sama untuk semua perusahaan.

Founder Ottodot ingin tahu: **apakah kamu benar-benar memahami masalah mereka, atau kamu hanya butuh pekerjaan?**

Engineer yang motivated oleh masalah spesifik akan bertahan lebih lama dan lebih committed daripada yang hanya tertarik pada tech stack atau remote work.

**Jebakan:**
- "Saya tertarik karena stack-nya modern" — ini tentang kamu, bukan tentang mereka
- "Saya suka edtech" — terlalu generik
- "Remote work cocok untuk saya" — salah fokus total

**Yang harus ada di jawaban kamu:**
- Tunjukkan kamu paham masalah spesifik mereka (bukan sekedar "edtech bagus")
- Hubungkan dengan sesuatu yang genuine dari background atau nilai kamu
- Sebutkan sesuatu yang spesifik dari job desc yang resonant

Contoh arah jawaban:
> *"Saya tertarik karena masalah yang Ottodot coba selesaikan sangat konkret: mengubah platform yang dibangun cepat oleh founder menjadi sistem yang bisa dipercaya oleh student, parent, dan teacher. Ini adalah jenis engineering yang paling bermakna bagi saya — bukan greenfield yang bersih, tapi sistem nyata dengan pengguna nyata yang butuh reliability. Ditambah konteks edtech untuk anak-anak yang belajar lewat games — saya percaya cara belajar yang tidak terasa seperti belajar adalah pendekatan yang benar, dan saya ingin bantu membangun platform yang mendukung itu."*

---

### Q4: "Do you have any questions for us?"

**Apa yang sebenarnya ditanya:**

Pertanyaan ini mengukur **seberapa dalam kamu sudah berpikir** tentang role ini. Kandidat yang tidak punya pertanyaan terlihat tidak serius. Kandidat yang tanya hal yang sudah ada di job desc terlihat tidak teliti.

**Pertanyaan yang menunjukkan kamu berpikir seperti engineer senior:**

Tentang teknis dan codebase:
> *"Apa bagian dari codebase yang paling urgent untuk distabilkan dalam 30 hari pertama?"*

> *"Seberapa besar test coverage yang ada sekarang, dan apakah ada ekspektasi untuk meningkatkannya?"*

Tentang cara kerja:
> *"Bagaimana proses pengambilan keputusan teknis sekarang — apakah ada RFC, atau lebih ke diskusi langsung dengan founder?"*

> *"Seperti apa ritme kerja mingguannya — ada standup, sprint, atau lebih async?"*

Tentang prioritas bisnis:
> *"Di antara student workflow, parent visibility, dan self-serve enrollment — mana yang paling critical untuk 3 bulan ke depan?"*

Tentang tim:
> *"Apakah saya akan jadi engineer pertama, atau ada engineer lain yang sudah bergabung?"*

---

### Gambaran Besar: Apa yang Dinilai dari 4 Pertanyaan Ini

| Pertanyaan | Yang Diukur |
|---|---|
| Q1: Project end to end | Judgment, ownership, kemampuan trade-off |
| Q2: AI tools | Apakah kamu multiplier, atau engineer biasa |
| Q3: Kenapa role ini | Genuine motivation vs job hunting biasa |
| Q4: Pertanyaan balik | Seberapa dalam kamu sudah berpikir |

Keempat pertanyaan ini bersama-sama menjawab satu pertanyaan besar di kepala founder: **"Bisakah saya mempercayakan orang ini untuk membuat keputusan engineering sendiri?"**

Jawab dengan spesifik, jujur, dan tunjukkan bahwa kamu sudah memikirkan masalah mereka — bukan hanya memikirkan dirimu sendiri.