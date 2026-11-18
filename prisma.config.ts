import { defineConfig } from "prisma/config";

// URL database dibaca dari env — JANGAN hardcode kredensial di sini.
// (Versi sebelumnya menulis postgresql://devuser:devpassword@localhost…
// langsung di file; itu hanya kredensial dev lokal, tapi tetap pola yang
// salah — sekarang lewat env dengan fallback lokal yang eksplisit.
// Sengaja pakai process.env, bukan env(): env() Prisma melempar error
// kalau variabelnya belum di-set, dan mode demo tidak butuh DATABASE_URL.)
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://devuser:devpassword@localhost:5432/prospecting",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
