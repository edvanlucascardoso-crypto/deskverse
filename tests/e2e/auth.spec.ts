import { expect, test } from "@playwright/test";

test.describe("autenticação", () => {
  test("envia o login sem exigir o campo de nome oculto", async ({ page }) => {
    let requestPayload: Record<string, unknown> | undefined;
    await page.route("**/api/auth/sign-in/email", async (route) => {
      requestPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Credenciais inválidas para este teste." }),
      });
    });

    await page.goto("/login", { waitUntil: "networkidle" });
    const email = page.getByLabel("E-mail");
    const password = page.getByLabel("Senha");
    await email.fill("teste@exemplo.com");
    await password.fill("senha-de-teste");
    await expect(email).toHaveValue("teste@exemplo.com");
    await expect(password).toHaveValue("senha-de-teste");
    const requestPromise = page.waitForRequest("**/api/auth/sign-in/email");
    await page.getByRole("button", { name: "Entrar no Deskverse" }).click();
    const request = await requestPromise;

    expect(request.method()).toBe("POST");
    expect(requestPayload).toMatchObject({ email: "teste@exemplo.com", password: "senha-de-teste" });
    await expect(page.getByRole("status")).toContainText("Credenciais inválidas para este teste.");
  });

  test("mostra feedback quando a autenticação não responde", async ({ page }) => {
    await page.route("**/api/auth/sign-in/email", (route) => route.abort());
    await page.goto("/login", { waitUntil: "networkidle" });
    await page.getByLabel("E-mail").fill("teste@exemplo.com");
    await page.getByLabel("Senha").fill("senha-de-teste");
    const requestPromise = page.waitForRequest("**/api/auth/sign-in/email");
    await page.getByRole("button", { name: "Entrar no Deskverse" }).click();
    await requestPromise;
    await expect(page.getByRole("status")).toContainText("Não foi possível conectar à autenticação.");
  });
});
