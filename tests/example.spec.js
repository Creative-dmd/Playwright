// this a playwright test for Google sign in
import { test, expect } from '@playwright/test';

test('sign in to Google', async ({ page }) => {
  await page.goto('https://accounts.google.com/signin');
  await expect(page).toHaveURL(/accounts\.google\.com\/signin/);

  // Enter email
  await page.fill('input[type="email"]', 'dennisdavid924@gmail.com');
  await page.click('button:has-text("Next")');

  // Wait for password field and enter password
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', '021005dmd');
  await page.click('button:has-text("Next")');

  // Wait for navigation or check for successful sign-in
  await page.waitForURL(/myaccount\.google\.com|mail\.google\.com/, { timeout: 20000 });
});