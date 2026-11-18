import { test, expect } from "@playwright/test";

test("dashboard: statistik + kanban seed + tabel ter-render", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  // Statistik seed: 7 prospek aktif, pipeline Rp14,7 jt
  await expect(page.getByText("Prospek aktif")).toBeVisible();
  await expect(page.getByText("Rp14.700.000")).toBeVisible();
  await expect(page.getByText("Demo dilihat")).toBeVisible();
  // Kanban: 8 kolom stage
  await expect(page.getByRole("heading", { name: "Pipeline", exact: true })).toBeVisible();
  for (const stage of ["Baru", "Demo Siap", "Follow-up", "Negosiasi", "Deal", "Ditolak", "Hilang Kontak", "Ditunda"]) {
    await expect(page.getByText(stage, { exact: true }).first()).toBeVisible();
  }
  // Kartu seed di kanban + tabel
  await expect(page.getByText("Kopi Ulee Kareng").first()).toBeVisible();
  await expect(page.getByText("Bakso Mas Joko").first()).toBeVisible();
  await expect(page.getByText("belum punya ✓ target").first()).toBeVisible();
});

test("dashboard: cari memfilter tabel", async ({ page }) => {
  await page.goto("/app");
  await page.getByLabel("Cari prospek").fill("klinik");
  await expect(page.getByRole("link", { name: "Klinik Gigi Senyum Ceria", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kopi Ulee Kareng", exact: true })).toHaveCount(0);
});

test("alur inti: tambah prospek → ubah stage → tambah aktivitas → buat demo → demo terbuka", async ({ page }) => {
  await page.goto("/app");

  // 1. Tambah prospek
  await page.getByRole("button", { name: "+ Tambah prospek" }).click();
  await page.getByPlaceholder("cth. Kopi Pagi Ceria").fill("Warkop Play-Test");
  await page.getByPlaceholder("cth. Kafe & Kopi").fill("Kafe & Kopi");
  await page.getByPlaceholder("62812xxxxxxx").fill("6281100001999");
  await page.getByRole("button", { name: "Simpan prospek" }).click();
  await expect(page.getByRole("link", { name: "Warkop Play-Test" }).first()).toBeVisible();

  // 2. Buka detail → ubah stage Baru → Demo Siap
  await page.getByRole("link", { name: "Warkop Play-Test" }).first().click();
  await expect(page).toHaveURL(/\/app\/prospek\//);
  await expect(page.getByRole("heading", { name: "Warkop Play-Test" })).toBeVisible();
  await page.getByLabel("Ubah stage").selectOption("demo_siap");
  await expect(page.getByText("Stage berubah: Baru → Demo Siap.")).toBeVisible();

  // 3. Tambah aktivitas catatan
  await page.getByLabel("Isi aktivitas").fill("Play-test: telepon pemilik, minta dikirim demo dulu.");
  await page.getByRole("button", { name: "Tambah", exact: true }).click();
  await expect(page.getByText("Play-test: telepon pemilik, minta dikirim demo dulu.")).toBeVisible();

  // 4. Buat demo dari template Kafe
  await page.getByLabel("Pilih template demo").selectOption("tpl-kafe");
  await page.getByRole("button", { name: "+ Buat demo" }).click();
  await expect(page.getByText(/Demo dibuat: \/d\/warkop-play-test-/)).toBeVisible();
  const demoLink = page.getByRole("link", { name: /\/d\/warkop-play-test-/ }).first();
  await expect(demoLink).toBeVisible();

  // 5. Buka demo — halaman mini prospek ter-render + tercatat dilihat
  await demoLink.click();
  await expect(page).toHaveURL(/\/d\/warkop-play-test-/);
  await expect(page.getByRole("heading", { name: /Warkop Play-Test — Tempat Nongkrong Favorit/ })).toBeVisible();
  await expect(page.getByText("Menu Unggulan")).toBeVisible();
});

test("detail seed: demo kopi-ulee-kareng sudah terkirim & dilihat", async ({ page }) => {
  await page.goto("/app/prospek/p-kopi-ulee-kareng");
  await expect(page.getByRole("heading", { name: "Kopi Ulee Kareng" })).toBeVisible();
  await expect(page.getByText("terkirim ✓")).toBeVisible();
  await expect(page.getByText("dilihat oleh pemilik ✓")).toBeVisible();
  await expect(page.getByText("Pemilik membuka link demo.")).toBeVisible();
});
