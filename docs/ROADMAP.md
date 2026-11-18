# Roadmap

## Fase 2 — Discover asli + mode server

- [ ] Discover sungguhan: Google Maps Places API (Text Search) +
  Playwright untuk nomor WA; `DiscoverJob` dikerjakan server,
  hasil tersimpan di `DiscoverJob.results`.
- [ ] Mode Postgres: API routes / Worker yang membaca `DATABASE_URL`
  (Prisma Client), migrasi awal dari `prisma/schema.prisma`.
- [ ] Auth sederhana (satu pengguna / tim kecil) sebelum data
  prospek sungguhan masuk server.
- [ ] Pelacak "dilihat" via endpoint (`POST /api/demo/:slug/viewed`
  di Worker) supaya metrik akurat lintas perangkat.
- [ ] Template kustom persist (saat ini hanya sesi).

## Fase 3 — Otomasi outreach

- [ ] Template pesan WA per stage (copy-paste siap kirim).
- [ ] Pengingat follow-up berdasarkan `dueAt` (badge + halaman
  "Butuh follow-up hari ini").
- [ ] Analitik demo: jumlah buka, terakhir dibuka, klik CTA.
- [ ] Impor massal (CSV) + ekspor pipeline (CSV).
- [ ] Multi-tim / multi-pengguna.

## Tidak akan dilakukan

- Scraping Google Maps tanpa API (melanggar ToS; pakai Places API).
- Kirim WA massal otomatis tanpa persetujuan (risiko blokir nomor).
- Menyimpan kredensial apa pun di repo.
