# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangerot.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-19

Rebuild total menjadi produk yang benar-benar jalan (program P1 #25).
Sebelumnya repo ini hanya scaffold Next.js + skema Prisma; CHANGELOG lama
mencantumkan klaim template (integrasi Supabase, sinkronisasi klien, dsb.)
yang tidak pernah ada di kode — entri itu diganti catatan jujur ini.

### Added
- Landing SaaS: navbar + logo GitHub, hero + preview produk, fitur, cara
  kerja, template, footer.
- Dashboard: statistik pipeline, Kanban 8 stage, tabel prospek dengan
  cari + filter stage, form tambah prospek.
- Detail prospek: linimasa aktivitas, ubah stage (tercatat otomatis),
  aksi berikut + tenggat, chat WhatsApp, hapus prospek.
- Template demo (Kafe & Kuliner, Klinik & Kesehatan, Jasa & Bengkel)
  + buat template sesi.
- Demo website personal per prospek — halaman publik `/d/<slug>` dengan
  palet template; penanda terkirim/dilihat.
- Discover: job kata kunci + kota, hasil + import ke pipeline
  (mode demo: data contoh berlabel).
- Store mode demo: localStorage + seed (10 prospek, 3 template, 2 demo,
  1 job) — `src/lib/store.tsx`, `src/lib/seed.ts`.
- Pages Worker (`worker/_worker.js`): `GET /api/status` + shell fallback
  rute dinamis; tes unit (7 tes, node --test).
- Playwright e2e (8 tes): landing, dashboard, alur inti, Discover.
- CI variatif: build, playwright-test, advisory-sweep (OSV), worker-test,
  smoke, docs.
- Docs lengkap: PRD v2.0, SDD, arsitektur, skema, desain, keamanan,
  deployment, demo, roadmap, DIAGRAMS.html (HTML+SVG).
- README standar repo top: screenshot asli + video demo 18 detik.
- Deploy live Cloudflare Pages: https://prospectingengine.pages.dev.

### Changed
- Next.js 16.3.8 → 16.4.6; `playwright` pindah ke devDependencies
  (mengecilkan pohon produksi untuk sweep OSV).
- `output: "export"` (static export) untuk Cloudflare Pages.
- `prisma.config.ts`: URL database dari `DATABASE_URL` (env), bukan
  lagi literal di file.
- `.gitignore`: `.env.example` kini ter-commit (pengecualian eksplisit).

### Fixed
- Navigasi client-side ke `/d/<slug>` macet di "Memuat demo…" —
  `usePathSegment` memakai `window.location` di initializer; diganti
  `usePathname()` yang reaktif.
- Deep link id/slug baru 404 di hosting statis — shell fallback di
  Worker dan `scripts/serve.mjs`.
- Nilai pipeline di contoh landing: Rp14,3 jt → Rp14,7 jt (hitungan
  benar dari seed).

### Security
- Audit secret: tidak ada secret ter-commit; URL Postgres dev lokal
  dipindah ke env (lihat `docs/SECURITY.md`).
- Sweep OSV produksi di CI (pengganti GitHub Advisory API yang gagal
  401 deterministik di CI repo sebelumnya).

## [0.1.0] - 2026-11-05

### Added
- Scaffold Next.js (create-next-app) + Tailwind v4.
- Skema Prisma: Prospect, Activity, Template, Demo, DiscoverJob
  (PostgreSQL).
- README + PRD template, LICENSE MIT, `.gitignore`.
