# PRD — Prospecting Engine (v2.0)

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama Proyek | Prospecting Engine |
| Tech Stack | Next.js 16.4.6 + React 19 + Tailwind v4 + Prisma 7 + Playwright |
| Status | Proper — live di Cloudflare Pages (mode demo) |
| Penanggung Jawab | Nabil Aulia Dika (dezzorigin) |
| Versi Dokumen | 2.0 |
| Tanggal | 19 Nov 2026 |
| Live | https://prospectingengine.pages.dev |

## 2. Latar Belakang

Penjual jasa pembuatan website menghabiskan sebagian besar waktunya untuk
satu hal: mencari usaha lokal yang belum punya website, lalu meyakinkan
pemiliknya. Tanpa alat, proses ini berupa spreadsheet dan chat WhatsApp yang
berserakan — siapa sudah dihubungi, siapa sudah dikirimi contoh, siapa
membuka contohnya, semua mengandalkan ingatan.

Prospecting Engine merapikan alur itu menjadi satu mesin: **Discover →
Demo → Kirim → Follow-up → Deal**. Idenya sudah ada di repo sejak awal
dalam bentuk skema Prisma (Prospect, Activity, Template, Demo,
DiscoverJob); v2.0 membangun aplikasi lengkap di atas skema itu.

## 3. Masalah yang Diselesaikan

1. **Mencari target itu lambat.** Usaha tanpa website tersebar di Google
   Maps; mengumpulkannya manual satu per satu tidak berskala.
2. **Contoh generik tidak meyakinkan.** Mengirim portofolio umum kalah
   dengan mengirim contoh website atas nama usaha si pemilik sendiri.
3. **Follow-up buta.** Tanpa tahu pemilik membuka link demo atau tidak,
   penjual menelepon di waktu yang salah — atau tidak menelepon sama sekali.
4. **Pipeline tercecer.** Status tiap prospek (baru, sudah dikirim demo,
   negosiasi, deal) tidak tercatat di satu tempat.

## 4. Tujuan & Sasaran

- Satu dashboard untuk seluruh pipeline: dari prospek baru sampai deal.
- Demo website personal bisa dibuat dalam < 1 menit per prospek.
- Setiap interaksi tercatat (catatan, panggilan, WA, demo dikirim/dilihat)
  dan setiap pindah stage tercatat otomatis.
- Produk bisa dicoba tanpa daftar, tanpa kunci API (mode demo), dan bisa
  naik kelas ke Postgres saat dibutuhkan (mode server).

## 5. Pengguna

| Pengguna | Kebutuhan |
|---|---|
| Penjual jasa website (solo/freelance) | Cari target, kirim demo, kejar closing |
| Tim agency kecil | Satu pipeline bersama (fase 2 — butuh backend) |
| Pemilik usaha (penerima demo) | Membuka satu link dan langsung melihat contoh websitenya |

## 6. Ruang Lingkup

### In Scope (v2.0 — mode demo)

- Landing SaaS: navbar + logo GitHub, hero + preview produk, fitur, cara
  kerja, template, footer.
- Dashboard: statistik pipeline, Kanban 8 stage, tabel prospek dengan
  cari + filter stage.
- CRUD prospek + pindah stage (otomatis tercatat sebagai aktivitas).
- Detail prospek: linimasa aktivitas, tambah catatan/panggilan/WA, aksi
  berikutnya + tenggat, hapus prospek.
- Template demo (3 bawaan) + buat template sesi.
- Buat demo dari template → halaman publik `/d/<slug>` dengan palet dan
  copy template; tandai terkirim; buka demo → tercatat dilihat.
- Discover: form kata kunci + kota → job pending → running → done,
  hasil bisa di-import ke pipeline (mode demo: data contoh berlabel).
- Pages Worker: `GET /api/status` + shell fallback rute dinamis.
- CI: build, lint, typecheck, Playwright e2e, advisory sweep OSV,
  tes worker, smoke, cek docs.

### Out of Scope (fase 2+)

- Discover sungguhan via Google Maps Places API + Playwright (butuh kunci
  API berbayar) — pola didokumentasikan di `docs/SDD.md`.
- Backend Postgres live + auth multi-pengguna (skema sudah siap).
- Kirim WA otomatis (saat ini: deep link `wa.me` + penandaan manual).
- Analitik demo lanjutan (durasi buka, klik) — saat ini hanya
  terkirim/dilihat.

## 7. Fitur & Persyaratan Fungsional

### 7.1 Landing (`/`)

- Navbar: logo, tautan Fitur/Cara kerja/Template/Dashboard, logo GitHub
  (kanan) yang mengarah ke `github.com/dezzorigin/prospecting-engine`,
  tombol Buka Dashboard.
- Hero: judul, subjudul, dua CTA (dashboard demo, contoh demo), preview
  produk statis (statistik + 4 kartu prospek).
- Strip angka, 6 kartu fitur, 4 langkah cara kerja, 3 kartu template,
  CTA akhir, footer (tautan + Lisensi MIT).

### 7.2 Dashboard (`/app`)

- 4 kartu statistik: prospek aktif, nilai pipeline (ribu rupiah),
  deal menang + nilainya, demo dilihat.
- Kanban 8 kolom stage (Baru, Demo Siap, Follow-up, Negosiasi, Deal,
  Ditolak, Hilang Kontak, Ditunda) dengan jumlah per kolom; kartu berisi
  nama, kategori/kota, rating, nilai deal, tenggat (tanda lewat tenggat).
- Tabel semua prospek: cari (nama/kategori/kota), filter stage, kolom
  website (belum punya = target), stage, nilai deal, aksi berikut.
- Form tambah prospek (nama wajib; kategori, kota, WA, alamat, website,
  nilai deal, aksi berikut).

### 7.3 Detail prospek (`/app/prospek/[id]`)

- Identitas, rating + ulasan, WA, website, Maps, nilai deal, tenggat,
  aksi berikutnya.
- Ubah stage via select atau tombol "Maju ke …" (otomatis mencatat
  aktivitas `perubahan_stage`).
- Chat WhatsApp (deep link `wa.me` + mencatat `wa_terkirim`).
- Demo: daftar demo (status terkirim/dilihat), salin link, tandai
  terkirim, pratinjau; buat demo baru dari template (prospek Baru
  otomatis pindah ke Demo Siap).
- Linimasa aktivitas + form tambah (catatan/panggilan/WA/demo dikirim).
- Hapus prospek (beserta aktivitas & demo — konfirmasi dulu).

### 7.4 Discover (`/app/discover`)

- Form kata kunci + kota → job baru status `running` → `done` ±2 detik.
- Tabel hasil: nama, alamat, rating + ulasan, website (belum punya =
  target), WA.
- Import ke pipeline: hanya yang belum ada (deduplikasi nama+kota),
  stage Baru, sumber `discover`.
- Riwayat job.

### 7.5 Template (`/app/template`)

- Kartu per template: palet, pratinjau hero + section, jumlah demo yang
  memakai, tanggal dibuat.
- Buat template sesi (nama, kategori, pilihan palet) — tidak persist di
  mode demo.

### 7.6 Halaman demo publik (`/d/[slug]`)

- Mini-website atas nama prospek: nav mini, hero (headline + subheadline
  + CTA WA + Maps), kartu section template, footer "halaman contoh".
- Dibuka → `viewedAt` tercatat + aktivitas `demo_dilihat` (hanya sekali).
- Slug tidak dikenal → halaman "Demo tidak ditemukan" dengan penjelasan
  mode demo + tautan contoh demo.

### 7.7 API Worker (`GET /api/status`)

- Respons: `{ ok, service: "prospecting-engine", mode: "demo", db,
  prisma }`. Tanpa secret.

## 8. Model Data

Lima model Prisma — lihat `prisma/schema.prisma` dan `docs/SCHEMA.md`:

| Model | Inti |
|---|---|
| Prospect | nama, kategori, kota, alamat, waNumber, rating, reviewCount, mapsUrl, website, source, stage (8 enum), nextAction, dueAt, dealValue (ribu Rp) |
| Activity | prospectId, type (6 enum), content |
| Template | nama, kategori, config JSON (palette, heroCopy, sections) |
| Demo | prospectId, templateId, slug unik, data JSON, sentAt, viewedAt |
| DiscoverJob | keyword, kota, status (pending/running/done/error), error, results JSON |

## 9. Persyaratan Non-Fungsional

- **Performa:** static export; halaman seed ter-render di HTML (tanpa
  menunggu JS); interaksi demo < 2 detik.
- **Keamanan:** tanpa secret ke-commit (`.env.example` saja); input
  pengguna di-render sebagai teks (React escape bawaan); nomor WA hanya
  dipakai untuk deep link `wa.me`.
- **Keterbukaan:** semua batas mode demo ditulis jujur di UI dan docs
  (data contoh Discover, data hanya di browser pembuat).
- **Portabilitas:** Linux/macOS/Windows; Node 20+; deploy Cloudflare Pages.
- **Kualitas:** CI hijau — build, lint 0 error, typecheck, 8 tes
  Playwright, 7 tes worker, sweep OSV 0 high/critical produksi, smoke.

## 10. Milestone / Roadmap

| Fase | Status |
|---|---|
| Scaffolding Next.js + skema Prisma | ✅ (awal) |
| Rebuild proper v2.0 — landing, dashboard, detail, template, discover, demo | ✅ 19 Nov 2026 |
| CI variatif (Playwright + worker + OSV) + deploy Pages | ✅ 19 Nov 2026 |
| Discover sungguhan (Places API + Playwright) | ⏳ fase 2 |
| Mode Postgres + auth | ⏳ fase 2 |
| Kirim WA otomatis + analitik demo | 📋 fase 3 |

Detail: `docs/ROADMAP.md`.

## 11. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Data demo hilang saat ganti browser | Dilabeli jelas di UI + footer; mode Postgres adalah jalur permanen |
| Discover contoh dikira data asli | Label "data contoh" di UI + docs; hasil tidak dipakai outreach |
| Kredensial dev ter-commit | `DATABASE_URL` lewat env; audit di `docs/SECURITY.md` |
| Link demo prospek baru 404 di hosting statis | Worker + serve.mjs shell fallback ke shell seed (diuji) |
| Dependensi produksi rentan | Sweep OSV di CI, fail pada high/critical |

## 12. Kriteria Keberhasilan

- Aplikasi berjalan tanpa error di dev dan di Pages live.
- 8/8 tes Playwright + 7/7 tes worker hijau; CI hijau di PR dan main.
- Play-test end-to-end tercatat: tambah prospek → ubah stage → aktivitas
  → buat demo → demo terbuka (lihat `docs/DEMO.md`).
- README berisi screenshot asli + video demo; docs lengkap PRD → semua
  layer + diagram HTML+SVG.
- Tidak ada secret ke-commit; sweep OSV 0 temuan high/critical produksi.

## 13. Lampiran

- Struktur & cara jalan: `README.md`
- Arsitektur: `docs/ARCHITECTURE.md`
- Desain: `docs/DESIGN.MD`
- Keamanan: `docs/SECURITY.md`
- Deployment: `docs/DEPLOYMENT.md`
- Diagram: `docs/DIAGRAMS.html`
- Lisensi: MIT (`LICENSE`)
