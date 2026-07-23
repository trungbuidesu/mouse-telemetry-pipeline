import { expect, test } from "@playwright/test";

test("renders the home shell and playable trainer route", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MouseStream" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open trainer/i })).toBeVisible();

  await page.goto("/play");

  await expect(page.getByRole("heading", { name: "Gameplay shell" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(page.getByTestId("aim-canvas")).toBeVisible();
});
