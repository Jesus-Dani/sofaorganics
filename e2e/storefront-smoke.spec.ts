import { test, expect } from "@playwright/test";

test("home → filter shop by use case → open a product → add to cart", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /herbs your grandmother would recognize/i })).toBeVisible();

  await page.getByRole("link", { name: "Shop Botanicals", exact: false }).click();
  await expect(page).toHaveURL(/\/shop\/type\/whole-leaves/);

  await page.getByRole("link", { name: "Memory & Focus" }).first().click();
  await expect(page.getByRole("heading", { name: "Memory & Focus" })).toBeVisible();

  await page.getByRole("link", { name: /Gingko Leaves/i }).first().click();
  await expect(page).toHaveURL(/\/products\/gingko-leaves/);

  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByRole("button", { name: /Open cart, 1 item/i })).toBeVisible();
});
