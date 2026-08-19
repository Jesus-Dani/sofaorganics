import { test, expect } from "@playwright/test";

test("cart → checkout → simulate payment → confirmation", async ({ page }) => {
  await page.goto("/products/gingko-leaves");
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("Your Cart (1)")).toBeVisible();

  await page.goto("/cart");
  await page.getByRole("link", { name: "Proceed to Checkout" }).click();

  await page.fill("#name", "Ada Obi");
  await page.fill("#email", "ada@example.com");
  await page.fill("#phone", "08012345678");
  await page.fill("#line1", "12 Aba Road");
  await page.fill("#city", "Port Harcourt");
  await page.fill("#state", "Rivers");

  await page.getByRole("button", { name: "Place order" }).click();
  await page.waitForURL(/\/checkout\/.+\/pay/);
  await expect(page.getByText("Complete your payment")).toBeVisible();

  await page.getByRole("button", { name: "Simulate Payment" }).click();
  await page.waitForURL(/\/checkout\/.+\/confirmation/);
  await expect(page.getByText(/Thank you, Ada/)).toBeVisible();
  await expect(page.getByText(/paid/i)).toBeVisible();
});
