# Desain

## 1. Prinsip

- **Hangat, bukan korporat.** Produk ini menjual jasa ke pemilik usaha
  kecil — nuansa kertas hangat + hijau teal terasa personal, bukan
  seperti dashboard enterprise.
- **Satu aksen, satu pekerjaan.** Hijau teal (`#0F766E`) hanya untuk
  aksi utama; hitam untuk navigasi aktif; amber hanya untuk penanda
  target ("belum punya website").
- **Data dulu, dekorasi kemudian.** Statistik, Kanban, dan tabel adalah
  isi produk — tanpa ilustrasi stok.

## 2. Token

| Token | Nilai | Pakai |
|---|---|---|
| `--color-paper` | `#FAF7F2` | Latar aplikasi |
| `--color-ink` | `#1C1917` | Teks utama, tombol gelap |
| `--color-ink-soft` | `#57534E` | Teks sekunder |
| `--color-line` | `#E7E0D4` | Border kartu/tabel |
| `--color-brand` | `#0F766E` | Aksi utama, tautan |
| `--color-brand-deep` | `#0B4F4A` | Hover aksi utama |
| `--color-brand-soft` | `#CCFBF1` | Latar label mode demo |
| `--color-amber-brand` | `#D97706` | Penanda target prospek |

Tipografi: Geist Sans (judul + isi), Geist Mono (slug, nomor WA,
path teknis). Judul memakai `tracking-tight` + bobot 700.

## 3. Komponen

- **Kartu** (`Card`): putih, radius 16px, border `line`, bayangan
  tipis 1px.
- **StageBadge**: pil warna per stage — Baru (langit), Demo Siap
  (ungu), Follow-up (amber), Negosiasi (oranye), Deal (hijau),
  Ditolak (rose), Hilang Kontak (zinc), Ditunda (stone).
- **Tombol utama**: pil penuh (`rounded-full`), brand, putih.
- **Tombol sekunder**: pil putih ber-border.
- **Kanban**: kolom lebar 256px, scroll horizontal, kartu putih
  dengan rating ★ amber + nilai deal.
- **Tabel**: header kecil uppercase, baris hover `paper/70`.

## 4. Template demo (identitas tiap template)

| Template | Nuansa | Palet |
|---|---|---|
| Kafe & Kuliner | Krem hangat, cokelat | bg `#FFF8EE`, aksen `#B45309` |
| Klinik & Kesehatan | Bersih, teal | bg `#F0FDFA`, aksen `#0F766E` |
| Jasa & Bengkel | Gelap tegas | bg `#0F172A`, aksen `#F59E0B` |

Halaman demo memakai palet template secara inline — demo yang
diterima pemilik usaha terasa dibuat khusus untuknya.

## 5. Responsif

- Landing: hero 2 kolom → 1 kolom di mobile; preview produk di bawah
  teks; nav atas ringkas (logo + GitHub + CTA).
- Dashboard: statistik 4 → 2 kolom; Kanban scroll horizontal;
  tabel scroll horizontal (min-width 720px).
- Detail: grid 2 kolom (demo + aktivitas) → 1 kolom di mobile.

Screenshot mobile: `screenshots/08-landing-mobile.png`.
