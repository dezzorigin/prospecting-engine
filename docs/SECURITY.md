# Keamanan

## 1. Audit secret (19 Nov 2026)

| Temuan | Status |
|---|---|
| `.env` / kredensial ter-commit | **Tidak ada.** `.gitignore` mengabaikan `.env*` (kecuali `.env.example`) |
| `DATABASE_URL` / API key di kode | **Tidak ada.** Satu-satunya string mirip kredensial adalah URL Postgres dev lokal di `prisma.config.ts` (lihat §2) |
| Token GitHub / Cloudflare di repo | **Tidak ada.** Deploy memakai token lewat API (tidak di-commit) |
| Nomor WA di seed | Nomor contoh `6281100001xxx` — bukan nomor asli; dilabeli data contoh |

Verifikasi: `grep -riE "api[_-]?key|secret|password|DATABASE_URL|token"`
di seluruh tree (di luar `node_modules`) — hanya mengenai `prisma.config.ts`
dan dokumentasi (`DATABASE_URL` sebagai nama variabel env).

## 2. `prisma.config.ts` — perbaikan

Versi awal repo menulis langsung:

```ts
database: "postgresql://devuser:devpassword@localhost:5432/prospecting"
```

Itu hanya kredensial dev lokal (bukan rahasia produksi), tapi polanya
salah: kredensial tidak boleh literal di file config. v2.0 memindahnya
ke `datasource.url` yang dibaca dari `process.env.DATABASE_URL` dengan
fallback lokal yang eksplisit dan terdokumentasi. Sengaja memakai
`process.env`, bukan `env()` Prisma — `env()` melempar error bila
variabel belum di-set, dan mode demo tidak butuh `DATABASE_URL` sama
sekali.

## 3. Ancaman & mitigasi

| Ancaman | Mitigasi |
|---|---|
| XSS via input pengguna (nama usaha, catatan) | React meng-escape semua teks saat render; tidak ada `dangerouslySetInnerHTML` di repo |
| Injeksi URL di `wa.me` / Maps | Nomor dibersihkan ke digit saja (`waLink`); URL Maps dari seed / hasil Discover |
| Data demo bocor antar pengguna | Data hanya di localStorage browser masing-masing; tidak ada server yang menyimpannya |
| Dependensi produksi rentan | Sweep OSV di CI — gagal pada HIGH/CRITICAL produksi (lihat §4) |
| Demo slug ditebak | Slug berisi 4 karakter acak; demo berisi info publik usaha (bukan data privat) |

## 4. Sweep dependensi (OSV)

`scripts/advisory-sweep.py` memeriksa HANYA paket produksi di
`package-lock.json` terhadap OSV (memirror GHSA, tanpa auth, satu POST
batch). Alasan memakai OSV, bukan GitHub Advisory API: versi GitHub-API
dengan `GITHUB_TOKEN` gagal deterministik 401 di CI repo sebelumnya
(orteam, 5x) — token per-job bermasalah, bukan skripnya.

Catatan klasifikasi: `playwright` + `@playwright/test` HARUS di
`devDependencies` — di `dependencies` ia menyeret ~190 paket ke pohon
produksi. `shadcn` CLI (bila dipakai) juga wajib dev-only.

Hasil: lihat run CI `advisory-sweep` (harus 0 temuan high/critical).

## 5. Batas mode demo (jujur)

- Tanpa auth: siapa pun yang membuka dashboard di browser itu melihat
  dan mengubah data demo di browser itu. Jangan pakai mode demo untuk
  data prospek sungguhan yang sensitif.
- "Dilihat" pada demo dicatat di perangkat pembuat demo, bukan lewat
  server — lihat `docs/ARCHITECTURE.md` §6.
- Discover mode demo memakai data contoh berlabel — jangan dipakai
  untuk outreach sungguhan.
