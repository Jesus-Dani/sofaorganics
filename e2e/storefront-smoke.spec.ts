import { test, expect } from "@playwright/test";

test("home → filter shop by use case → open a product → add to cart", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /herbs your grandmother would recognize/i })).toBeVisible();

  await page.getByRole("link", { name: "Shop Botanicals", exact: false }).click();
  await expect(page).toHaveURL(/\/shop\/type\/whole-leaves/);

  await page.getByRole("link", { name: "Memory & Focus" }).first().click();
  await expect(page).toHaveURL(/use_case=memory-focus/);

  await page.getByRole("link", { name: /Gingko Leaves/i }).first().click();
  await expect(page).toHaveURL(/\/products\/gingko-leaves/);

  await page.getByRole("button", { name: "Add to Cart" }).click();
  // Radix Dialog marks the rest of the page aria-hidden while the cart drawer is
  // open, so assert on the drawer's own content rather than the now-hidden header.
  await expect(page.getByRole("heading", { name: "Your Cart (1)" })).toBeVisible();
});
