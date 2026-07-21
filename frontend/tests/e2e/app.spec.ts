import { expect, test } from "@playwright/test";

test("renders the baseline shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MouseStream" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open trainer/i })).toBeVisible();
});
