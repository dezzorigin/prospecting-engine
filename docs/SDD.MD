# SDD — Software Design Document

## 1. Gambaran

Prospecting Engine adalah aplikasi Next.js (App Router, static export)
dengan satu store client-side. Tidak ada server aplikasi: logika bisnis
hidup di `src/lib/store.tsx`, data hidup di localStorage, dan skema
Prisma adalah kontrak data untuk mode server di masa depan.

## 2. Modul

| Modul | Tanggung jawab |
|---|---|
| `src/lib/types.ts` | Tipe + label + helper — cerminan 1:1 `prisma/schema.prisma` |
| `src/lib/seed.ts` | Data contoh (10 prospek, 3 template, 2 demo, 1 job, 5 aktivitas) |
| `src/lib/store.tsx` | `StoreProvider` — state, persistensi, semua aksi bisnis |
| `src/components/ui.tsx` | `StageBadge`, `Stars`, `Card`, `PageHeader`, `EmptyState` |
| `src/app/page.tsx` | Landing SaaS (server component, tanpa store) |
| `src/app/app/page.tsx` | Dashboard — statistik, Kanban, tabel, form tambah |
| `src/app/app/prospek/[id]/detail-client.tsx` | Detail prospek |
| `src/app/app/discover/page.tsx` | Discover + riwayat job |
| `src/app/app/template/page.tsx` | Template + buat template sesi |
| `src/app/d/[slug]/demo-client.tsx` | Halaman demo publik |
| `worker/_worker.js` | Pages Worker — `/api/status` + shell fallback |
| `scripts/advisory-sweep.py` | Sweep OSV dependensi produksi |
| `scripts/serve.mjs` | Server statis lokal ala Pages |
| `scripts/shots.mjs` | Screenshot README/video |

## 3. Store (`src/lib/store.tsx`)

### 3.1 State & persistensi

- State awal: `seedState()` (sinkron — dipakai render server).
- Setelah mount: `queueMicrotask` memuat `localStorage["pe-store-v1"]`
  lalu `loaded = true`. Pola ini menghindari hydration mismatch:
  server dan render pertama klien sama-sama seed.
- Setiap perubahan state disimpan kembali ke localStorage (efek).
- `resetDemo()` mengembalikan seed (tombol di header dashboard).

### 3.2 Aksi bisnis

| Aksi | Efek samping |
|---|---|
| `addProspect` | Prospek baru stage `baru`, `source` manual |
| `updateProspect` | Patch + `updatedAt` |
| `deleteProspect` | Hapus prospek + aktivitas + demonya (cascade) |
| `setStage` | Ubah stage + aktivitas `perubahan_stage` otomatis |
| `addActivity` | Tambah ke linimasa (terbaru dulu) |
| `createDemo` | Demo baru (slug unik), prospek `baru` → `demo_siap`, catat pembuatan |
| `markDemoSent` | `sentAt` + aktivitas `demo_dikirim` |
| `markDemoViewed` | `viewedAt` + aktivitas `demo_dilihat` (sekali saja) |
| `runDiscover` | Job `running` → `done` ±1,8 detik (simulasi) |
| `importDiscoverResults` | Tambah hasil yang belum ada (deduplikasi nama+kota) |

### 3.3 `usePathSegment()`

Mengambil segmen terakhir path lewat `usePathname()` (next/navigation).
Sengaja TIDAK memakai `window.location` di initializer `useState`:
saat navigasi client-side, komponen rute baru di-render React SEBELUM
`window.location` berubah — initializer akan mengunci segmen URL lama
(kosong untuk `/`) dan tidak pernah diperbarui. Bug ini ditemukan saat
play-test (landing → demo macet di "Memuat demo…") dan diperbaiki
dengan `usePathname` yang reaktif.

## 4. Halaman dinamis & shell fallback

`output: "export"` hanya mem-prerender slug/id seed
(`generateStaticParams`). Id/slug buatan pengguna tidak punya file —
deep link-nya disajikan dari shell seed:

- Produksi: `worker/_worker.js` → `shellFor()` → `/d/kopi-ulee-kareng.html`
  atau `/app/prospek/p-kopi-ulee-kareng.html`.
- Lokal: `scripts/serve.mjs` meniru fallback yang sama.
- Komponen klien memuat record yang benar dari id di URL
  (`usePathSegment`), jadi shell mana pun menampilkan data yang benar.

Render awal halaman dinamis memakai seed secara sinkron (konten seed
ada di HTML statis); setelah store termuat, sumber beralih ke state
live. Penandaan "dilihat" baru berjalan setelah store termuat, supaya
tidak tertimpa pemuatan localStorage.

Catatan hydration (React #418): shell prerender berisi konten seed,
sedangkan deep link id/slug NON-seed butuh konten lain. Bila render
pertama klien memakai id dari URL, ia menampilkan "Memuat…" — padahal
HTML shell berisi konten seed → hydration mismatch. Solusinya: halaman
dinamis menerima `shellSlug`/`shellId` (prop dari `page.tsx`, terbawa
di payload RSC shell) dan memakai itu pada render pertama; HANYA
setelah store termuat (`loaded`), id beralih ke id dari URL. Untuk
id/slug seed, keduanya sama — tanpa kedipan. Pola ini ditemukan dari
dua React #418 saat play-test live, setelah `suppressHydrationWarning`
terbukti tidak cukup (ia hanya meredam perbedaan teks, bukan
perbedaan struktur subtree).

## 5. Discover — simulasi mode demo

Tanpa kunci Google Maps Places API, `buildDiscoverResults()` membangkitkan
hasil deterministik dari kata kunci + kota (pool nama per kategori:
kopi, bakso, klinik, bengkel, salon, laundry, default). Hasil DILABELI
data contoh di UI dan docs — bukan data Maps asli.

### 5.1 Pola produksi (fase 2)

1. `DiscoverJob` dibuat status `pending`.
2. Worker/server memanggil Places API (Text Search: kata kunci + kota,
   filter `business_status=OPERATIONAL`, ambil `website` untuk menandai
   target tanpa website).
3. Playwright (opsional) mengambil nomor WA dari website/Maps saat
   Places tidak menyediakannya.
4. Hasil disimpan ke `DiscoverJob.results` (JSON), status `done`.
5. Import: seperti sekarang (deduplikasi nama+kota, stage `baru`).

## 6. Demo website (`/d/[slug]`)

- Data demo (`Demo.data`) dibuat dari `Template.config`: headline
  (placeholder `{nama}`/`{kota}` diganti data prospek), subheadline,
  CTA, dan sections.
- Render memakai `Template.config.palette` secara inline (bg, surface,
  ink, muted, accent) — tiap template terasa berbeda.
- CTA utama: deep link `wa.me/<nomor>?text=…` ke pemilik usaha.
- `viewedAt` dicatat sekali saat halaman dibuka (efek + guard ref).

## 7. Validasi

- Form tambah prospek: nama wajib (HTML `required`); nilai deal numerik.
- Stage hanya dari enum `STAGES` (select — tidak ada string bebas).
- `createDemo` melempar error bila template/prospek tidak ditemukan.
- Slug: `slugify(nama)` + 4 karakter acak (hindari bentrok).

## 8. Pengujian

- **Playwright e2e** (`e2e/`): 8 tes — landing, dashboard, cari,
  alur inti (tambah → stage → aktivitas → demo → buka demo),
  detail seed, Discover + import, riwayat job.
- **Tes unit worker** (`worker/_worker.test.mjs`): 7 tes node --test —
  status, shellFor, resolusi `.html`, fallback deep link, 404.
- **Smoke CI**: serve `out/` + curl — hero, link GitHub, fitur,
  footer, seed di dashboard, demo seed, favicon, 404.
- **Advisory sweep OSV**: produksi saja, gagal pada high/critical.
- **Pelajaran CI (19 Nov 2026):** `LayoutProps` dari template
  create-next-app bergantung pada `next-env.d.ts` yang DIGENERATE
  (`next build`) — di checkout bersih CI file itu tidak ada dan
  `tsc --noEmit` gagal `TS2304: Cannot find name 'LayoutProps'`,
  padahal lokal lolos (file sudah ter-generate). Perbaikan: ketik
  props layout eksplisit (`{ children: React.ReactNode }`). Jangan
  pernah mengandalkan global dari `next-env.d.ts` di kode sumber.
