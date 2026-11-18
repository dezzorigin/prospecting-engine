# Deployment

## 1. Target

- **Proyek:** `prospectingengine`
- **Live:** https://prospectingengine.pages.dev
- **Platform:** Cloudflare Pages (direct upload via API, tanpa Git
  integration — deploy dilakukan manual dari `out/`).

## 2. Build

```bash
npm ci
npm run build    # next build (static export) + cp worker/_worker.js out/_worker.js
```

Prasyarat: Node 20+. Tanpa environment variable (mode demo).

## 3. Deploy

Menggunakan `scripts` di `~/workspace/github-actions/cf_pages.py`
(pola yang sama dipakai repo P1 #19–#24):

```bash
python3 ~/workspace/github-actions/cf_pages.py create-project prospectingengine
python3 ~/workspace/github-actions/cf_pages.py deploy prospectingengine out/
```

Deploy mengunggah aset (hash blake3, hanya yang berubah) lalu membuat
deployment dengan `_worker.bundle` dari `out/_worker.js`.

### Nama proyek

Nama `prospecting-engine` dicoba pertama; ketersediaan nama TIDAK bisa
dicek via GET project (404 hanya berarti bukan milik akun kita) — nama
adalah namespace global dan baru ketahuan saat create. Hasil create:
**HTTP 409 — dipakai akun Cloudflare lain**. Fallback pertama
`prospectingengine` berhasil bersih, tanpa sufiks. Nama final yang
terpakai: **`prospectingengine`** (https://prospectingengine.pages.dev).

## 4. Verifikasi live

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://prospectingengine.pages.dev/
curl -s https://prospectingengine.pages.dev/ | grep -q "Cari usaha tanpa website" && echo "hero OK"
curl -s https://prospectingengine.pages.dev/app | grep -q "Kopi Ulee Kareng" && echo "dashboard seed OK"
curl -s https://prospectingengine.pages.dev/d/kopi-ulee-kareng | grep -q "Tempat Nongkrong Favorit" && echo "demo seed OK"
curl -s https://prospectingengine.pages.dev/api/status
# {"ok":true,"service":"prospecting-engine","mode":"demo",...}
```

Play-test live: buka dashboard → tambah prospek → ubah stage →
buat demo → buka `/d/<slug>` (lihat `docs/DEMO.md`).

## 5. About repo (homepage)

Setelah live terverifikasi, pasang link di About repo:

```bash
PATCH /repos/dezzorigin/prospecting-engine  { "homepage": "https://prospectingengine.pages.dev" }
```

Lalu verifikasi `GET /repos/dezzorigin/prospecting-engine` mengembalikan
`homepage` tersebut.

## 6. Rollback

Deploy sebelumnya tetap ada di daftar deployment Pages — rollback
dengan mempromosikan deployment lama, atau deploy ulang dari commit
sebelumnya (`git checkout <sha> && npm run build && deploy`).

## 7. Mode server (tidak dipakai deployment ini)

Bila mode Postgres diaktifkan suatu hari: jalankan migrasi
(`npx prisma migrate deploy` dengan `DATABASE_URL` produksi), lalu
deploy aplikasi Next.js non-statis (bukan Pages static export) —
lihat `docs/ARCHITECTURE.md` §2.
