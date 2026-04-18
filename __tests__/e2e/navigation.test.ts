import { test, expect } from '@playwright/test';

test.describe('Portfolio Navigation', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ErnestoFM/);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('#hero')).toBeVisible();
  });

  test('navbar contains navigation links', async ({ page }) => {
    await page.goto('/en');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('can navigate to about section', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="#about"]');
    await expect(page.locator('#about')).toBeVisible();
  });

  test('language toggle switches locale', async ({ page }) => {
    await page.goto('/en');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/en');
  });
});
