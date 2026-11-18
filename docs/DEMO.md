# Demo — Cara Mencoba & Bukti Play-Test

## Cara mencoba (2 menit)

1. Buka https://prospecting-engine.pages.dev — landing tampil tanpa daftar.
2. Klik **Coba dashboard demo** → masuk `/app`.
3. **Dashboard**: statistik pipeline terlihat (7 prospek aktif,
   Rp14.700.000). Kanban 8 kolom stage; tabel di bawah dengan cari &
   filter.
4. **Tambah prospek**: klik **+ Tambah prospek**, isi nama (cth.
   "Warkop Play-Test"), simpan — kartu baru muncul di kolom Baru.
5. **Detail**: klik kartu → ubah stage ke **Demo Siap** (aktivitas
   "Stage berubah" tercatat) → tambah catatan → pilih template
   **Kafe & Kuliner** → **+ Buat demo**.
6. **Demo**: klik link `/d/warkop-play-test-xxxx` → halaman demo
   atas nama usaha itu terbuka (headline, menu, jam & lokasi).
7. **Discover**: buka `/app/discover`, jalankan "kopi" di Banda Aceh
   → hasil muncul → **+ Import ke pipeline** → prospek baru di dashboard.
8. **Reset demo**: tombol di header mengembalikan seed awal.

Semua perubahan tersimpan di localStorage browser — refresh halaman
dan datamu tetap ada; buka di browser lain dan kembali ke seed.

## Bukti play-test (19 Nov 2026, lokal)

Play-test dilakukan lewat Playwright (headless Chrome) terhadap build
produksi yang disajikan `scripts/serve.mjs` — 8/8 tes hijau
(`e2e/*.spec.ts`):

- Landing: hero + link GitHub + preview + fitur + footer — **lolos**.
- Contoh demo dari hero: `/d/kopi-ulee-kareng` terbuka, headline +
  section Menu Unggulan ter-render — **lolos**.
- Dashboard: statistik Rp14.700.000, 8 kolom stage, seed ter-render — **lolos**.
- Cari "klinik" memfilter tabel (Klinik Gigi Senyum Ceria saja) — **lolos**.
- Alur inti: tambah "Warkop Play-Test" → stage Baru → Demo Siap
  (aktivitas tercatat) → tambah catatan → buat demo template Kafe →
  buka demo (headline + Menu Unggulan) — **lolos**.
- Detail seed: demo kopi-ulee-kareng "terkirim ✓" + "dilihat oleh
  pemilik ✓" — **lolos**.
- Discover: job "kopi" selesai, hasil muncul, import → prospek baru
  di dashboard — **lolos**.

Dua bug nyata ditemukan & diperbaiki selama play-test:

1. **Navigasi client-side macet di "Memuat demo…"** — `usePathSegment`
   memakai `window.location` di initializer `useState`; saat navigasi
   client-side, komponen baru di-render sebelum `window.location`
   berubah, sehingga slug terkunci "". Perbaikan: pakai `usePathname()`
   (lihat `docs/SDD.MD` §3.3).
2. **Deep link id/slug baru 404 di server statis** — hanya seed yang
   punya file prerender. Perbaikan: shell fallback di `worker/_worker.js`
   dan `scripts/serve.mjs` (lihat `docs/SDD.MD` §4).

Screenshot: `docs/screenshots/` (01 hero, 02 full landing,
03 dashboard, 04 detail, 05 discover, 06 template, 07 demo,
08 mobile, 09 dashboard setelah tambah prospek).
Video demo: `docs/demo/demo.mp4` (18 detik, 1280×720, slideshow dari
screenshot di atas).

## Yang TIDAK didemo (jujur)

- Discover sungguhan (Google Maps Places API) — tidak ada kunci API;
  mode demo memakai data contoh berlabel.
- Backend Postgres live — skema ada, belum ada server yang menjalankannya.
- Kirim WA otomatis — yang ada deep link `wa.me` + penandaan manual.
- Sinkronisasi antar perangkat — data hanya di browser masing-masing.
