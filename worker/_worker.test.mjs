// Tes unit Pages Worker (node --test, tanpa dependensi eksternal).
// Menjalankan: npm test
import test from "node:test";
import assert from "node:assert/strict";
import handler, { statusPayload, shellFor } from "./_worker.js";

test("statusPayload: mode demo, tanpa secret", () => {
  const p = statusPayload();
  assert.equal(p.ok, true);
  assert.equal(p.service, "prospecting-engine");
  assert.equal(p.mode, "demo");
});

test("shellFor: /d/<slug> dan /app/prospek/<id> dapat shell seed", () => {
  assert.equal(shellFor("/d/kopi-ulee-kareng"), "/d/kopi-ulee-kareng.html");
  assert.equal(shellFor("/d/usaha-baru-abc1"), "/d/kopi-ulee-kareng.html");
  assert.equal(shellFor("/app/prospek/p-bakso-mas-joko"), "/app/prospek/p-kopi-ulee-kareng.html");
  assert.equal(shellFor("/app"), null);
  assert.equal(shellFor("/"), null);
  assert.equal(shellFor("/api/status"), null);
  assert.equal(shellFor("/d/"), null);
});

function fakeAssets(files) {
  return {
    async fetch(req) {
      const path = new URL(req.url).pathname;
      if (Object.prototype.hasOwnProperty.call(files, path)) {
        return new Response(files[path], { status: 200 });
      }
      return new Response("not found", { status: 404 });
    },
  };
}

test("GET /api/status -> 200 JSON", async () => {
  const res = await handler.fetch(
    new Request("https://prospecting-engine.pages.dev/api/status"),
    { ASSETS: fakeAssets({}) }
  );
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.service, "prospecting-engine");
  assert.equal(body.mode, "demo");
});

test("rute extensionless diselesaikan ke .html", async () => {
  const env = { ASSETS: fakeAssets({ "/app.html": "<h1>Dashboard</h1>" }) };
  const res = await handler.fetch(new Request("https://x/app"), env);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Dashboard/);
});

test("deep link /d/<slug> baru disajikan shell seed", async () => {
  const env = {
    ASSETS: fakeAssets({ "/d/kopi-ulee-kareng.html": "<h1>Demo shell</h1>" }),
  };
  const res = await handler.fetch(new Request("https://x/d/usaha-baru-abc1"), env);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Demo shell/);
});

test("deep link /app/prospek/<id> baru disajikan shell seed", async () => {
  const env = {
    ASSETS: fakeAssets({ "/app/prospek/p-kopi-ulee-kareng.html": "<h1>Detail shell</h1>" }),
  };
  const res = await handler.fetch(new Request("https://x/app/prospek/p-xyz"), env);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Detail shell/);
});

test("rute tak dikenal tetap 404", async () => {
  const env = { ASSETS: fakeAssets({ "/index.html": "<h1>Home</h1>" }) };
  const res = await handler.fetch(new Request("https://x/tidak-ada"), env);
  assert.equal(res.status, 404);
});
