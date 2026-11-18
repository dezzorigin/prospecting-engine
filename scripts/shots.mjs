// Screenshot untuk README + video demo (headless Chrome lokal).
// Usage: node scripts/shots.mjs [baseUrl]
// Output: docs/screenshots/*.png
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://127.0.0.1:8336";
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });

const chrome = process.env.PE_CHROME_PATH ??
  `${process.env.HOME}/.cache/ms-playwright/chromium-1234/chrome-linux/chrome`;

const browser = await chromium.launch({ executablePath: chrome, args: ["--no-sandbox"] });

async function shot(name, url, { width = 1280, height = 800, fullPage = true, wait = null } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: "networkidle" });
  if (wait) await wait(page);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}`, fullPage });
  console.log("shot", name);
  await page.close();
}

const settled = async (page) => {
  await page.waitForTimeout(800);
};

await shot("01-landing-hero.png", `${BASE}/`, { fullPage: false, wait: settled });
await shot("02-landing-full.png", `${BASE}/`, { wait: settled });
await shot("03-dashboard.png", `${BASE}/app`, { wait: settled });
await shot("04-prospek-detail.png", `${BASE}/app/prospek/p-kopi-ulee-kareng`, { wait: settled });
await shot("05-discover.png", `${BASE}/app/discover`, { wait: settled });
await shot("06-template.png", `${BASE}/app/template`, { wait: settled });
await shot("07-demo.png", `${BASE}/d/kopi-ulee-kareng`, { wait: settled });
await shot("08-landing-mobile.png", `${BASE}/`, { width: 390, height: 844, wait: settled });

// Bukti play-test alur inti: tambah prospek via UI, lalu screenshot kanban.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "+ Tambah prospek" }).click();
  await page.getByPlaceholder("cth. Kopi Pagi Ceria").fill("Warkop Play-Test");
  await page.getByPlaceholder("cth. Kafe & Kopi").fill("Kafe & Kopi");
  await page.getByRole("button", { name: "Simpan prospek" }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/09-dashboard-tambah-prospek.png`, fullPage: true });
  console.log("shot 09-dashboard-tambah-prospek.png");
  await page.close();
}

await browser.close();
console.log("done");
