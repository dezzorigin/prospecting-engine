// Cloudflare Pages _worker.js — Prospecting Engine.
//
// Aplikasi Next.js adalah static export (`output: 'export'`), jadi tidak
// bisa membawa route handler dinamis: `next build` menolak /api/* dan
// middleware saat static export. Worker ini adalah server produksi untuk
// semua itu, dan menyajikan sisanya dari static export lewat binding ASSETS.
//
// Yang dikerjakan worker:
//   1. GET /api/status — dipakai smoke test CI + halaman About di repo.
//   2. Shell fallback untuk rute dinamis: /d/<slug> dan /app/prospek/<id>
//      hanya punya SATU file hasil prerender per seed (lihat
//      generateStaticParams). Slug/id buatan pengguna tidak punya file —
//      sajikan shell seed itu; komponen klien memuat record yang benar
//      dari id di URL (lihat usePathSegment di src/lib/store.tsx).
//      Tanpa ini, refresh / deep link ke demo baru akan 404.
//   3. Resolusi <rute> -> <rute>.html ala Cloudflare Pages.
//
// Mode demo: tanpa database server — semua data hidup di localStorage
// browser (lihat src/lib/store.tsx). Worker tidak butuh secret apa pun.

export function statusPayload() {
  return {
    ok: true,
    service: "prospecting-engine",
    mode: "demo",
    db: "localStorage (browser)",
    prisma: "schema-only — sambungkan DATABASE_URL untuk mode Postgres",
  };
}

/** Path shell prerender untuk deep link dinamis, atau null. */
export function shellFor(pathname) {
  if (/^\/d\/[^/]+\/?$/.test(pathname)) return "/d/kopi-ulee-kareng.html";
  if (/^\/app\/prospek\/[^/]+\/?$/.test(pathname)) return "/app/prospek/p-kopi-ulee-kareng.html";
  return null;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

const handler = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/status" && request.method === "GET") {
      return json(statusPayload());
    }

    if (env.ASSETS) {
      let asset = await env.ASSETS.fetch(request);
      // Static export menyimpan halaman sebagai <rute>.html, sementara
      // URL yang diminta adalah <rute> (tanpa ekstensi). Jangan bergantung
      // pada pemetaan default Pages — coba <rute>.html secara eksplisit.
      if (asset.status === 404 && !url.pathname.split("/").pop().includes(".")) {
        const html = await env.ASSETS.fetch(
          new Request(new URL(`${url.pathname.replace(/\/$/, "")}.html`, request.url))
        );
        if (html.status !== 404) asset = html;
      }
      if (asset.status !== 404) return asset;
      const shell = shellFor(url.pathname);
      if (shell) {
        return env.ASSETS.fetch(new Request(new URL(shell, request.url)));
      }
      return asset;
    }
    return new Response("Not found", { status: 404 });
  },
};

export default handler;
