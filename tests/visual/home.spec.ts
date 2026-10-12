import { expect, test } from '@playwright/test';

import { preparePage, VIEWPORTS } from './prepare-page.ts';

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`home page, ${name}`, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page }) => {
      await page.goto('/ru');
      await preparePage(page);
    });

    test('matches the approved screenshot', async ({ page }) => {
      await expect(page).toHaveScreenshot(`home-${name}.png`, { fullPage: true });
    });

    test('labour inspection with a selected region matches the approved screenshot', async ({ page }) => {
      const inspection = page.getByRole('region', { name: 'Обратитесь в региональную инспекцию труда' });
      await inspection.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Актюбинская область' }).click();

      await expect(inspection).toHaveScreenshot(`labour-inspection-selected-${name}.png`);
    });
  });
}
