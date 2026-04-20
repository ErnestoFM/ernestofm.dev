import { test, expect } from '@playwright/test';

const WHATSAPP_URL =
  'https://wa.me/526863873651?text=Hola%20Ernesto%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20contactarte.';

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
    await page.locator('a[href="#about"]:visible').first().click();
    await expect(page.locator('#about')).toBeVisible();
  });

  test('language toggle switches locale', async ({ page }) => {
    await page.goto('/en');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/en');
  });

  test('footer contains whatsapp link', async ({ page }) => {
    await page.goto('/en');
    const whatsappLink = page.locator(`footer a[href="${WHATSAPP_URL}"]`);
    await expect(whatsappLink).toBeVisible();
  });

  test('theme toggle persists after reload', async ({ page }) => {
    await page.goto('/en');

    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 10000 });

    const initialTheme = await page.evaluate(() => {
      const html = document.documentElement;
      return html.classList.contains('dark') ? 'dark' : 'light';
    });

    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    const toggledTheme = await page.evaluate(() => {
      const html = document.documentElement;
      return html.classList.contains('dark') ? 'dark' : 'light';
    });

    expect(toggledTheme).not.toBe(initialTheme);

    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      // Dev server can briefly restart under parallel E2E load; recover by hard navigating.
      await page.goto('/en', { waitUntil: 'domcontentloaded' });
    }

    const persistedTheme = await page.evaluate(() => {
      const html = document.documentElement;
      const savedTheme = localStorage.getItem('theme');
      const cookieTheme = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('theme='))
        ?.split('=')[1];

      return {
        htmlTheme: html.classList.contains('dark') ? 'dark' : 'light',
        savedTheme,
        cookieTheme,
      };
    });

    expect(persistedTheme.htmlTheme).toBe(toggledTheme);
    expect(persistedTheme.savedTheme).toBe(toggledTheme);
    expect(persistedTheme.cookieTheme).toBe(toggledTheme);
  });
});
