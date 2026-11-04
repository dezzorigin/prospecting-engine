# Prospecting Engine

Prospecting Engine — project oleh Nabil Aulia Dika (dezzorigin).

## Status Proyek

**Hampir selesai (beta)** _(README ada, build artifact ada)_

## 🌐 Live Demo

**https://8a6dceae.prospecting-engine-133.pages.dev**

## 📋 Tech Stack

Next.js

## 🏗️ Arsitektur

```mermaid
flowchart LR
  U[Pengguna] --> B[Browser]
  B --> F[Frontend (React/Next.js)]
  F --> A[API Routes]
  A --> D[(Database)]
```

## 📁 Struktur Proyek

```
.agents/
.claude/
.cursor/
.devin/
.wrangler/
prisma/
public/
src/
LICENSE
PRD.md
README.md
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
prisma.config.ts
tsconfig.json
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

> Untuk project HTML/Python/Go, lihat instruksi di atas atau file konfigurasi.

## 📄 Lisensi

MIT — lihat [LICENSE](./LICENSE).

---
_Dikembangkan oleh **dezzorigin** (Nabil Aulia Dika)._
