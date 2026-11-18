#!/usr/bin/env node
/**
 * Static server kecil untuk play-test lokal + CI smoke.
 *
 * Kenapa bukan `python3 -m http.server`: `next build` (output: "export",
 * Next 16) menulis BERSAMAAN `workspace.html` DAN direktori `workspace/`
 * berisi artefak debug `__next.*.txt`. Server berbasis direktori akan
 * me-redirect /workspace -> /workspace/ lalu menampilkan directory
 * listing — padahal Cloudflare Pages menyajikan `workspace.html` untuk
 * path extensionless itu (terbukti live di my-dayz /dashboard = 200).
 * Server ini meniru resolusi Pages: path tanpa ekstensi -> `<path>.html`.
 * Plus shell fallback ala worker/_worker.js: rute dinamis /d/<slug> dan
 * /app/prospek/<id> buatan pengguna tidak punya file prerender (hanya
 * seed yang di-generateStaticParams) — sajikan shell seed supaya deep
 * link tetap memuat record yang benar dari id di URL.
 *
 * Usage: PORT=8336 node scripts/serve.mjs [dir=out]
 */
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const PORT = Number(process.env.PORT ?? 8336);
const ROOT = resolve(process.argv[2] ?? "out");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  let file = join(ROOT, path);
  // Resolusi ala Pages: /workspace -> workspace.html
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const html = `${file.replace(/\/$/, "")}.html`;
    if (existsSync(html) && statSync(html).isFile()) file = html;
  }
  // Shell fallback ala worker/_worker.js (shellFor): id/slug buatan
  // pengguna tidak punya file prerender — sajikan shell seed.
  if ((!existsSync(file) || statSync(file).isDirectory()) && !path.split("/").pop().includes(".")) {
    const shell =
      /^\/d\/[^/]+\/?$/.test(path)
        ? "/d/kopi-ulee-kareng.html"
        : /^\/app\/prospek\/[^/]+\/?$/.test(path)
          ? "/app/prospek/p-kopi-ulee-kareng.html"
          : null;
    if (shell) {
      const shellFile = join(ROOT, shell);
      if (existsSync(shellFile) && statSync(shellFile).isFile()) file = shellFile;
    }
  }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found\n");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`));
