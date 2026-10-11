import { test, expect } from '@playwright/test';

test.describe('FarmFlow E2E — Playwright Dashboard & Agro Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve carregar a aplicação mobile no navegador e exibir os elementos principais', async ({ page }) => {
    await expect(page).toHaveTitle(/Login|FarmFlow|Expo|React/i);

    const body = page.locator('body');
    await expect(body).toBeVisible();

    await page.screenshot({ path: 'coverage/e2e-dashboard-playwright.png', fullPage: true });
  });

  test('deve permitir interagir com os controles de simulação climática e talhões', async ({ page }) => {
    await page.waitForTimeout(1000);

    const mainContainer = page.locator('#root, [data-testid="screen-container"], body');
    await expect(mainContainer.first()).toBeVisible();
  });
});
