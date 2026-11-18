# Arsitektur

## 1. Gambaran runtime

```
Browser ──► Cloudflare Pages ──► Static export (out/)
   │              │
   │              └──► _worker.js (Pages Worker)
   │                     ├── GET /api/status
   │                     ├── <rute> → <rute>.html
   │                     └── /d/<slug> · /app/prospek/<id> → shell seed
   │
   └──► localStorage (pe-store-v1) — seluruh data mode demo
```

Tidak ada server aplikasi, tidak ada database di deployment ini.
Satu-satunya kode server adalah Pages Worker (stateless, tanpa secret).

## 2. Mode demo vs mode server

| Aspek | Mode demo (yang di-deploy) | Mode server (fase 2) |
|---|---|---|
| Penyimpanan | localStorage browser | PostgreSQL via Prisma |
| Data awal | Seed (`src/lib/seed.ts`) | `prisma migrate` + seed |
| Auth | Tidak ada | Belum ditentukan |
| Discover | Data contoh deterministik | Places API + Playwright |
| Kirim WA | Deep link `wa.me` + tandai manual | Sama + webhook status (rencana) |
| Multi-perangkat | Tidak sinkron | Sinkron via API |

Peralihan mode tidak mengubah tipe data: `src/lib/types.ts` adalah
cerminan 1:1 `prisma/schema.prisma`. Yang berubah hanya lapisan
penyimpanan (store localStorage → Prisma Client) dan Discover
(simulasi → Places API).

## 3. Alur data

### 3.1 Membuka dashboard

1. Browser meminta `/app` → Pages menyajikan `app.html` (statis).
2. JS hydrate; `StoreProvider` me-render seed, lalu memuat
   localStorage dan `loaded = true`.
3. Statistik, Kanban, dan tabel dihitung dari state (memo).

### 3.2 Membuat demo

1. Di detail prospek, pilih template → `createDemo(prospectId,
   templateId)`.
2. Demo dibuat (slug unik), prospek `baru` → `demo_siap`, aktivitas
   pembuatan dicatat, state tersimpan ke localStorage.
3. Link `/d/<slug>` disalin → dikirim via WA (deep link).
4. Pemilik membuka link → halaman demo ter-render dari `Demo.data` +
   palet template → `markDemoViewed` mencatat `viewedAt`.

### 3.3 Deep link ke demo/id baru

1. Browser meminta `/d/usaha-baru-abc1` (tidak ada file prerender).
2. Worker: ASSETS 404 → coba `.html` → 404 → `shellFor()` cocok →
   sajikan `/d/kopi-ulee-kareng.html`.
3. Komponen klien membaca slug dari URL (`usePathSegment`) dan memuat
   demo yang benar dari store.

## 4. Struktur build

```
npm run build
  ├─ next build            # static export → out/
  └─ cp worker/_worker.js out/_worker.js
```

`out/` berisi: `index.html`, `app.html`, `app/discover.html`,
`app/template.html`, `app/prospek/<10 seed>.html`,
`d/<2 seed>.html`, aset `_next/static/*`, `favicon.ico`,
`_worker.js`.

## 5. Keputusan arsitektur

| Keputusan | Alasan |
|---|---|
| Static export + Worker (bukan SSR) | Pages gratis + cepat; produk demo tidak butuh SSR |
| localStorage (bukan Supabase) | Nol kunci, nol akun; seed langsung hidup |
| Prisma dipertahankan | Skema adalah aset repo; mode server tinggal sambung `DATABASE_URL` |
| Playwright di devDependencies | Test runner bukan dependensi produksi (mengecilkan permukaan sweep OSV) |
| Next 16.4.6 | Naik dari 16.3.8 mengikuti pola repo P1 sebelumnya |
| Worker `_worker.js` terpisah | `next build` menolak route handler saat static export |
| Diagram HTML+SVG (bukan Mermaid) | Standar docs P1 (diagram-design) |

## 6. Batas yang diketahui

- Data demo hanya di satu browser (tidak sinkron).
- Halaman dinamis non-seed mengandalkan shell fallback Worker —
  tanpa Worker (mis. hosting statis murni), deep link id baru 404.
- `markDemoViewed` mencatat "dilihat" per perangkat pembuat demo,
  bukan per perangkat pemilik usaha — metrik ini akurat saat demo
  dibuat dan dibuka di perangkat yang sama dengan akun dashboard.
  (Batas mode demo; fase server memakai endpoint pelacak sungguhan.)
