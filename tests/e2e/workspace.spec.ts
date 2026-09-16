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
    const narrowTiles = page.locator(".agent-tile");
    await expect(narrowTiles).toHaveCount(13);
    for (let index = 0; index < 5; index += 1) await expect(narrowTiles.nth(index)).toBeVisible();

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

  test("allows the office request to advance one step at a time and notifies the workspace", async ({ page }) => {
    await page.getByRole("button", { name: "Acompanhar pedidos" }).click();
    await expect(page.getByRole("heading", { name: "Uma etapa por vez" })).toBeVisible();

    await page.getByRole("button", { name: "Iniciar trabalho" }).click();
    await expect(page.getByText("Em andamento", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Pedir aprovação", exact: true }).click();
    await expect(page.getByText("Aguardando sua aprovação", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Aprovar item" })).toBeVisible();

    await page.getByRole("button", { name: "Aprovar item" }).click();
    await expect(page.getByRole("button", { name: "Confirmar entrega" })).toBeVisible();
    await page.getByRole("button", { name: "Confirmar entrega" }).click();
    await expect(page.getByText("Concluído", { exact: true })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Do pedido à entrega" })).not.toBeVisible();
    await expect(page.locator("main")).not.toHaveAttribute("aria-hidden", "true");
    await page.getByRole("button", { name: "Abrir notificações" }).click();
    const notification = page.getByRole("button", { name: /A entrega foi registrada com sucesso/ });
    await expect(notification).toBeVisible();
    await notification.click();
    await expect(page.getByRole("heading", { name: "Do pedido à entrega" })).toBeVisible();
  });

  test("creates an office request with the validated form", async ({ page }) => {
    await page.getByRole("button", { name: "Acompanhar pedidos" }).click();
    await page.getByRole("button", { name: "Novo pedido" }).click();
    await expect(page.getByRole("heading", { name: "O que precisa ser feito?" })).toBeVisible();

    await page.getByRole("button", { name: "Criar pedido" }).click();
    await expect(page.getByText("Dê um nome com pelo menos 3 caracteres.")).toBeVisible();
    await expect(page.getByText("Explique o que precisa ser feito.")).toBeVisible();

    await page.getByLabel("Nome do pedido").fill("Campanha de primavera");
    await page.getByLabel("Objetivo").fill("Preparar uma publicação para apresentar a coleção de primavera.");
    await page.getByLabel("Como saberemos que está pronto?").fill("Texto revisado e arte pronta para aprovação");
    await page.getByLabel("Contexto adicional opcional").fill("Priorizar clientes atuais.");
    await page.getByRole("button", { name: "Criar pedido" }).click();

    await expect(page.getByRole("heading", { name: "Campanha de primavera" })).toBeVisible();
    await expect(page.getByText("Preparar uma publicação para apresentar a coleção de primavera.")).toBeVisible();
  });

  test("observes a queued document job from ready to success", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Abrir fila de trabalho" }).click();
    await expect(page.getByRole("heading", { name: "Fila de trabalho" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Validar documento/ })).toBeVisible();

    await page.getByRole("button", { name: "Assumir próxima tarefa" }).click();
    await expect(page.locator(".queue-state-pill").getByText("Em andamento", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Concluir tarefa" }).click();
    await expect(page.locator(".queue-state-pill").getByText("Concluída", { exact: true })).toBeVisible();
    await expect(page.getByText("Tarefa concluída e registrada", { exact: true })).toBeVisible();
  });
});
