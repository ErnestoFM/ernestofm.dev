import { test, expect } from '@playwright/test';

const WHATSAPP_URL =
  'https://wa.me/526863873651?text=Hola%20Ernesto%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20contactarte.';

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
    await expect(form.locator('input[name="honeypot"]')).toBeHidden();
    await expect(form.locator('input[type="text"][required]:visible').first()).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('textarea')).toBeVisible();
  });

  test('submit button is present', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form.locator('button[type="submit"]:visible')).toBeVisible();
  });

  test('whatsapp button in contact has correct link', async ({ page }) => {
    const form = page.locator('#contact form');
    const whatsappLink = form.locator(`a[href="${WHATSAPP_URL}"]`);
    await expect(whatsappLink).toBeVisible();
  });
});
