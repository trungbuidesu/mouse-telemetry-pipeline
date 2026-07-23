import { expect, test } from "@playwright/test";

test("renders the home shell and playable trainer route", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MouseStream" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open trainer/i })).toBeVisible();

  await page.goto("/play");

  await expect(page.getByRole("heading", { name: "Gameplay" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(page.getByTestId("aim-canvas")).toBeVisible();
});

test("plays a short session and shows client result", async ({ page }) => {
  await page.route("**/api/v1/events/batch", async (route) => {
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        accepted: true,
        batchSequence: 1,
        eventCount: 1,
      }),
    });
  });
  await page.route("**/api/v1/sessions/*/metrics", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "processing" }),
    });
  });

  await page.goto("/play");
  await page.getByRole("button", { name: "30s" }).click();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByText("Running", { exact: true })).toBeVisible({
    timeout: 10_000,
  });

  await page.getByTestId("aim-canvas").click({ position: { x: 40, y: 40 } });
  await page.getByRole("button", { name: "Stop" }).click();

  await expect(page).toHaveURL(/\/result\/.+/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Session completed" })).toBeVisible();
  await expect(page.getByText("Client (provisional)")).toBeVisible();
});
