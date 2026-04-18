import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('contact form is visible', async ({ page }) => {
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('contact form has all required fields', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form.locator('input[type="text"]').first()).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('textarea')).toBeVisible();
  });

  test('submit button is present', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });
});
