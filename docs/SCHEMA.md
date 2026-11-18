# Skema Data (Prisma)

Sumber kebenaran: [`prisma/schema.prisma`](../prisma/schema.prisma)
(PostgreSQL, Prisma 7, generator `prisma-client` ke
`src/generated/prisma`, preview `fullTextSearch`).

## 1. Model

### Prospect — `prospects`

Usaha target prospeksi.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String @id @default(cuid()) | |
| nama | String | Nama usaha |
| kategori | String? | cth. "Kafe & Kopi" |
| kota | String? | |
| alamat | String? | |
| waNumber | String? → `wa_number` | Nomor WA (format 62…) |
| rating | Float? | Rating Google Maps |
| reviewCount | Int? → `review_count` | Jumlah ulasan |
| mapsUrl | String? → `maps_url` | Link Google Maps |
| website | String? | **null = belum punya website (target utama)** |
| source | String @default("manual") | `manual` \| `discover` |
| stage | Stage @default(baru) | Lihat §2 |
| nextAction | String? → `next_action` | Aksi berikut |
| dueAt | DateTime? → `due_at` | Tenggat aksi berikut |
| dealValue | Int? → `deal_value` | **Dalam ribu rupiah** |
| createdAt / updatedAt | DateTime | |

Index: `(stage, dueAt)`, `(createdAt)`. Relasi: `activities[]`,
`demos[]` (cascade delete ada di sisi Activity/Demo).

### Activity — `activities`

Satu baris = satu interaksi / peristiwa pada prospek.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String @id @default(cuid()) | |
| prospectId | String → `prospect_id` | FK → Prospect, onDelete Cascade |
| type | ActivityType | Lihat §2 |
| content | String | Isi catatan / peristiwa |
| createdAt | DateTime | |

Index: `(prospectId, createdAt)`.

### Template — `templates`

Template demo website.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String @id @default(cuid()) | |
| nama | String | cth. "Kafe & Kuliner" |
| kategori | String | |
| config | Json | `{ palette, heroCopy, sections }` — lihat §3 |
| createdAt | DateTime | |

Relasi: `demos[]`.

### Demo — `demos`

Demo website personal untuk satu prospek dari satu template.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String @id @default(cuid()) | |
| prospectId | String → `prospect_id` | FK → Prospect, Cascade |
| templateId | String → `template_id` | FK → Template |
| slug | String @unique | Slug URL publik `/d/<slug>` |
| data | Json | Hasil render template — lihat §3 |
| createdAt | DateTime | |
| sentAt | DateTime? → `sent_at` | Kapan link dikirim via WA |
| viewedAt | DateTime? → `viewed_at` | Kapan pemilik membuka link |

Index: `(prospectId)`.

### DiscoverJob — `discover_jobs`

Satu eksekusi pencarian Discover.

| Field | Tipe | Keterangan |
|---|---|---|
| id | String @id @default(cuid()) | |
| keyword | String | Kata kunci usaha |
| kota | String | |
| status | String @default("pending") | `pending` \| `running` \| `done` \| `error` |
| error | String? | Pesan error bila gagal |
| results | Json? | Array hasil (lihat §4) |
| createdAt / doneAt | DateTime | |

## 2. Enum

### Stage (8)

| Nilai | Arti |
|---|---|
| `baru` | Baru ditemukan / ditambahkan |
| `demo_siap` | Demo website sudah dibuat |
| `follow_up` | Demo terkirim, menunggu tanggapan |
| `negosiasi` | Diskusi harga / paket |
| `deal` | Menang — mulai kerjakan |
| `ditolak` | Menolak |
| `hilang_kontak` | Tidak bisa dihubungi lagi |
| `ditunda` | Tunda (alasan di catatan) |

Stage terbuka (masuk nilai pipeline): `baru`, `demo_siap`,
`follow_up`, `negosiasi`.

### ActivityType (6)

`catatan`, `wa_terkirim`, `demo_dikirim`, `demo_dilihat`,
`panggilan`, `perubahan_stage`.

## 3. JSON `Template.config` & `Demo.data`

```jsonc
// Template.config
{
  "palette": { "bg": "#FFF8EE", "surface": "#FFFFFF", "ink": "#2B1D0E",
               "muted": "#8A6D4B", "accent": "#B45309", "accentInk": "#FFFFFF" },
  "heroCopy": { "title": "{nama} — … di {kota}", "subtitle": "…", "cta": "Chat WhatsApp" },
  "sections": [ { "type": "menu", "title": "Menu Unggulan", "items": ["…"] } ]
}
// Demo.data — hasil render config untuk satu prospek
{
  "headline": "Kopi Ulee Kareng — Tempat Nongkrong Favorit di Banda Aceh",
  "subheadline": "…",
  "ctaText": "Chat WhatsApp",
  "sections": [ { "type": "menu", "title": "Menu Unggulan", "items": ["…"] } ]
}
```

## 4. JSON `DiscoverJob.results[]`

```jsonc
{
  "nama": "Kopi Pagi Ceria", "kategori": "Kopi", "kota": "Banda Aceh",
  "alamat": "Jl. Contoh No. 12, Banda Aceh",
  "waNumber": "628110002011", "rating": 4.4, "reviewCount": 188,
  "mapsUrl": "https://maps.google.com/?q=…",
  "website": null  // null = target
}
```

## 5. Mode server (Postgres lokal)

```bash
cp .env.example .env   # isi DATABASE_URL
npx prisma migrate dev --name init
npx prisma studio      # lihat data
npx prisma generate    # client ke src/generated/prisma
```

`prisma.config.ts` membaca `DATABASE_URL` dari env (fallback dev lokal
`postgresql://devuser:devpassword@localhost:5432/prospecting` — hanya
untuk dev lokal, bukan kredensial produksi).

## 6. Korespondensi dengan mode demo

`src/lib/types.ts` adalah cerminan 1:1 model di atas (nama field
camelCase, `dealValue` ribu rupiah, `dueAt` ISO string). Seed
(`src/lib/seed.ts`) memakai nilai yang valid terhadap skema ini —
10 prospek, 3 template, 2 demo, 1 job, 5 aktivitas.
