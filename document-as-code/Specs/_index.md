# Specs Index

> 📌 **Panduan AI**: Baca HANYA file ini untuk orientasi dokumen proyek.
> Buka file detail di direktori ini HANYA jika user menyebut file tersebut secara eksplisit,
> atau jika task yang sedang dikerjakan membutuhkan konteks dari file tersebut.
> **JANGAN** baca seluruh direktori ini sekaligus — satu file per kebutuhan.

---

## 📁 Daftar Dokumen Spesifikasi

| ID | File | Fase | Deskripsi Singkat | Terakhir Diperbarui |
| -- | ---- | ---- | ----------------- | ------------------- |
| `S01` | [brief.md](brief.md) | Teknis | Stack teknologi, struktur folder, stakeholder, timeline, dan scope ClassLoop | 2026-09-20 |
| `S02` | [vision.md](vision.md) | Fase 0 — Discovery | Problem statement, target user per role, MVP scope bertahap, dan constraints | 2026-09-20 |
| `S03` | [architecture.md](architecture.md) | Fase 1 — System Design | Architecture diagram, ERD lengkap, API contract, RLS strategy, trade-offs | 2026-09-20 |
| `S04` | [S04-DAC-User-Workflow-Guide.md](S04-DAC-User-Workflow-Guide.md) | Panduan | Flow serta sampel skenario use case nyata implementasi DAC lengkap | 2026-07-06 |
| `S05` | [SOP-Software-Development-Checklist.md](SOP-Software-Development-Checklist.md) | Panduan | SOP checklist pengembangan software profesional dari BA hingga QA/DevOps | 2026-07-06 |

> 💡 **Cara Menambah Dokumen Baru**: Buat file `.md` baru di folder ini dengan nama kebab-case
> (misal: `payment-service.md`, `notification-system.md`), lalu tambahkan baris baru di tabel di atas dengan ID berikutnya (`S06`, `S07`, dst.).

---

## 🤖 Cara AI Menggunakan Direktori Ini

**Skenario 1 — Orientasi Awal Proyek**:
AI membaca `Specs/_index.md` → Tahu file apa saja yang ada → Selesai (tidak membaca lebih lanjut).

**Skenario 2 — User Menyebut File Spesifik**:
```
"Berdasarkan Specs/architecture.md, buat task breakdown-nya."
```
AI hanya membaca `Specs/architecture.md` → Baca `Tasks/_index.md` → Buat task file.

**Skenario 3 — Membuat Task dari Spec**:
AI menambahkan field `source_spec` di front matter task baru:
```yaml
source_spec: "Specs/architecture.md"
```

---

*Last updated: 2026-09-20*
