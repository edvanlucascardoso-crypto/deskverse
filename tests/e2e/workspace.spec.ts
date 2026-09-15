import { expect, test } from "@playwright/test";

test.describe("workspace canvas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?demo=1", { waitUntil: "networkidle" });
    await expect(page.locator(".agent-tile").first()).toBeVisible();
  });

  test("renders the canvas with accessible controls", async ({ page }) => {
    await expect(page).toHaveTitle("Deskverse — Workspace");
    await expect(page.getByRole("region", { name: /Canvas em grade de agentes/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Marina Social/ })).toBeVisible();
  });

  test("keeps the drawer-first surface on the canvas", async ({ page }) => {
    const canvas = page.locator(".workspace-canvas");
    const tile = page.locator(".agent-tile").first();

    await expect(canvas).toHaveCSS("background-image", "none");
    await expect(tile).toHaveCSS("border-style", "solid");
    await expect(tile).toHaveCSS("border-radius", "14px");

    const surface = await tile.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { backgroundImage: styles.backgroundImage, boxShadow: styles.boxShadow };
    });

    expect(surface.backgroundImage).toContain("linear-gradient");
    expect(surface.boxShadow).toContain("rgba");
  });

  test("preserves four compact slots on a narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".agent-tile").first()).toBeVisible();

    const boxes = await Promise.all(
      Array.from({ length: 5 }, (_, index) => page.locator(".agent-tile").nth(index).boundingBox()),
    );
    const [first, second, third, fourth, fifth] = boxes;

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(third).not.toBeNull();
    expect(fourth).not.toBeNull();
    expect(fifth).not.toBeNull();
    expect(Math.abs((first?.y ?? 0) - (fourth?.y ?? 0))).toBeLessThan(2);
    expect((fifth?.y ?? 0)).toBeGreaterThan((first?.y ?? 0) + (first?.height ?? 0) / 2);
    expect(Math.abs((first?.width ?? 0) - (first?.height ?? 0))).toBeLessThan(2);
  });

  test("opens an agent context drawer without losing the canvas", async ({ page }) => {
    await page.getByRole("button", { name: /Marina Social/ }).click();
    await expect(page.locator(".context-panel")).toBeVisible();
    await expect(page.getByText("Próximo passo", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: /Canvas em grade de agentes/i })).toBeVisible();
  });
});
