import { expect, test } from '@playwright/test';

import { preparePage, VIEWPORTS } from './prepare-page.ts';

const PAGES = [
  { name: 'about', path: '/ru/about' },
  { name: 'employer', path: '/ru/employer' },
  { name: 'employee', path: '/ru/employee' },
  { name: 'help-faq', path: '/ru/help/faq' },
  { name: 'help-normative', path: '/ru/help/normative' },
  { name: 'help-instructions', path: '/ru/help/instructions' },
  { name: 'help-videos', path: '/ru/help/videos' },
  { name: 'help-services', path: '/ru/help/services' },
  { name: 'help-agreements', path: '/ru/help/agreements' },
  { name: 'self-check', path: '/ru/self-check' },
  { name: 'self-check-question', path: '/ru/self-check/hiring' },
  { name: 'news', path: '/ru/news' },
  { name: 'news-article', path: '/ru/news/ectd-deadline-liability' },
] as const;

const SELF_CHECK_RESULTS = {
  'self-check-result-high': ['Нет', 'Нет', 'Нет', 'Нет', 'Да', 'Нет', 'Не знаю', 'Да'],
  'self-check-result-low': ['Да', 'Да', 'Да', 'Да', 'Да', 'Да', 'Да', 'Да'],
} as const;

for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(viewportName, () => {
    test.use({ viewport });

    for (const { name, path } of PAGES) {
      test(`${name} matches the approved screenshot`, async ({ page }) => {
        await page.goto(path);
        await preparePage(page);

        await expect(page).toHaveScreenshot(`${name}-${viewportName}.png`, { fullPage: true });
      });
    }

    for (const [name, answers] of Object.entries(SELF_CHECK_RESULTS)) {
      test(`${name} matches the approved screenshot`, async ({ page }) => {
        await page.goto('/ru/self-check/hiring');
        for (const answer of answers) {
          await page.getByRole('radio', { name: answer, exact: true }).check();
          await page.getByRole('button', { name: /Далее|Результат/u }).click();
        }
        await page.getByRole('heading', { level: 2 }).first().waitFor();
        await page.evaluate(() => {
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        });
        await preparePage(page);

        await expect(page).toHaveScreenshot(`${name}-${viewportName}.png`, { fullPage: true });
      });
    }
  });
}
