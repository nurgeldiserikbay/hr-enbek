import { expect, test } from '@playwright/test';

import { findUnexpectedAxeViolations } from './axe.ts';

test('IR-UI-03: root redirects to the Kazakh version by default', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/kk$/u);
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
});

test('IR-UI-03: any path without a locale gets the Kazakh prefix', async ({ page }) => {
  await page.goto('/missing-page');

  await expect(page).toHaveURL(/\/kk\/missing-page$/u);
});

test('IR-UI-07: home page has no axe violations', async ({ page }) => {
  await page.goto('/ru');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await findUnexpectedAxeViolations(page)).toEqual([]);
});

test('IR-UI-07: skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/ru');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Перейти к содержимому' })).toBeFocused();
});

test('admin is not indexed by search engines', async ({ page }) => {
  await page.goto('/admin');

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});
