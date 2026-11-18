import { test, expect } from "@playwright/test";

test("discover: jalankan job → hasil muncul → import ke pipeline", async ({ page }) => {
  await page.goto("/app/discover");
  await expect(page.getByRole("heading", { name: "Discover", exact: true })).toBeVisible();

  await page.getByLabel("Kata kunci usaha").fill("kopi");
  await page.getByLabel("Kota").fill("Banda Aceh");
  await page.getByRole("button", { name: "Jalankan Discover" }).click();

  // Status running lalu done dengan hasil
  await expect(page.getByText(/Hasil: “kopi” di Banda Aceh/)).toBeVisible();
  await expect(page.getByText("Kopi Pagi Ceria")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("belum punya ✓").first()).toBeVisible();

  // Import → prospek baru masuk pipeline
  await page.getByRole("button", { name: "+ Import ke pipeline" }).click();
  await expect(page.getByText(/prospek baru ditambahkan ke pipeline/)).toBeVisible();
  await page.getByRole("link", { name: "Lihat di dashboard →" }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("link", { name: "Kopi Pagi Ceria" }).first()).toBeVisible();
});

test("discover: riwayat job seed tampil", async ({ page }) => {
  await page.goto("/app/discover");
  await expect(page.getByText("Riwayat Discover job")).toBeVisible();
  await expect(page.getByText("“kopi”", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("3 hasil")).toBeVisible();
});
