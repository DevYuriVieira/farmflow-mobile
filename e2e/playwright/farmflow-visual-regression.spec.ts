import { test, expect } from '@playwright/test';

test.describe('FarmFlow — Automated Visual Regression Testing Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1200);
  });

  test('visual snapshot matches baseline for initial agro landing view', async ({ page }) => {
    const mainContainer = page.locator('#root');
    await expect(mainContainer).toBeVisible();

    await expect(page).toHaveScreenshot('farmflow-landing-screen.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('visual snapshot matches baseline for mobile viewport root container', async ({ page }) => {
    const rootContainer = page.locator('#root');
    await expect(rootContainer).toBeVisible();

    await expect(rootContainer).toHaveScreenshot('farmflow-root-container.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });
});
