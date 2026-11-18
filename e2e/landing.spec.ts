import { test, expect } from "@playwright/test";

test("landing: hero + navbar GitHub + preview + fitur + footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Cari usaha tanpa website, kirim demo, closing deal/ })).toBeVisible();
  // Navbar: logo GitHub kanan yang link ke repo
  const gh = page.getByRole("link", { name: "Lihat repo di GitHub" });
  await expect(gh).toBeVisible();
  await expect(gh).toHaveAttribute("href", "https://github.com/dezzorigin/prospecting-engine");
  // Preview produk di hero
  await expect(page.getByText("Dashboard — Pipeline")).toBeVisible();
  await expect(page.getByText("Kopi Ulee Kareng").first()).toBeVisible();
  // Fitur
  await expect(page.getByRole("heading", { name: /Satu mesin, dari cari sampai closing/ })).toBeVisible();
  await expect(page.getByText(/Discover — cari usaha tanpa website/)).toBeVisible();
  await expect(page.getByText(/Pantau siapa yang membuka demo/)).toBeVisible();
  // Cara kerja + template + footer
  await expect(page.getByRole("heading", { name: "Cara kerja" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Template demo yang langsung terasa personal/ })).toBeVisible();
  await expect(page.getByText(/Lisensi MIT/)).toBeVisible();
  // CTA ke dashboard
  await page.getByRole("link", { name: "Coba dashboard demo →" }).click();
  await expect(page).toHaveURL(/\/app$/);
});

test("landing: contoh demo bisa dibuka dari hero", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Lihat contoh demo" }).click();
  await expect(page).toHaveURL(/\/d\/kopi-ulee-kareng/);
  await expect(page.getByRole("heading", { name: /Kopi Ulee Kareng — Tempat Nongkrong Favorit/ })).toBeVisible();
});
