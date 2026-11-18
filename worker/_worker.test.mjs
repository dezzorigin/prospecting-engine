// Tes unit Pages Worker (node --test, tanpa dependensi eksternal).
// Menjalankan: npm test
import test from "node:test";
import assert from "node:assert/strict";
import handler, { statusPayload, shellFor, flightFor } from "./_worker.js";

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

test("flightFor: payload flight rute dinamis baru -> payload seed", () => {
  assert.equal(flightFor("/app/prospek/p-xyz.txt"), "/app/prospek/p-kopi-ulee-kareng.txt");
  assert.equal(flightFor("/app/prospek/p-xyz/__next._tree.txt"), "/app/prospek/p-kopi-ulee-kareng/__next._tree.txt");
  assert.equal(flightFor("/app/prospek/p-xyz/__next._full.txt"), "/app/prospek/p-kopi-ulee-kareng/__next._full.txt");
  assert.equal(
    flightFor("/app/prospek/p-xyz/__next.app.prospek.$d$id.__PAGE__.txt"),
    "/app/prospek/p-kopi-ulee-kareng/__next.app.prospek.$d$id.__PAGE__.txt"
  );
  assert.equal(flightFor("/d/usaha-baru.txt"), "/d/kopi-ulee-kareng.txt");
  assert.equal(flightFor("/d/usaha-baru/__next._tree.txt"), "/d/kopi-ulee-kareng/__next._tree.txt");
  assert.equal(
    flightFor("/d/usaha-baru/__next.d.$d$slug.__PAGE__.txt"),
    "/d/kopi-ulee-kareng/__next.d.$d$slug.__PAGE__.txt"
  );
  assert.equal(flightFor("/app/prospek/p-bakso-mas-joko.txt"), "/app/prospek/p-kopi-ulee-kareng.txt");
  assert.equal(flightFor("/app/discover/__next._tree.txt"), null);
  assert.equal(flightFor("/app/prospek/p-xyz.html"), null);
  assert.equal(flightFor("/tidak-ada.txt"), null);
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
    new Request("https://prospectingengine.pages.dev/api/status"),
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

test("navigasi client-side ke /app/prospek/<id> baru disajikan flight seed, bukan HTML shell", async () => {
  const env = {
    ASSETS: fakeAssets({
      "/app/prospek/p-kopi-ulee-kareng.txt": "1:\"$Sreact.fragment\"",
      "/app/prospek/p-kopi-ulee-kareng/__next._tree.txt": "4:[[\"children\"]]",
      "/app/prospek/p-kopi-ulee-kareng.html": "<h1>Detail shell</h1>",
    }),
  };
  const res = await handler.fetch(new Request("https://x/app/prospek/p-xyz.txt?_rsc=abc"), env);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /react\.fragment/);
  const tree = await handler.fetch(new Request("https://x/app/prospek/p-xyz/__next._tree.txt?_rsc=abc"), env);
  assert.equal(tree.status, 200);
  assert.match(await tree.text(), /children/);
});
