import { expect, test } from '@playwright/test';

import { findUnexpectedAxeViolations } from './axe.ts';

const SITE_PAGES = [
  'employer',
  'employee',
  'about',
  'help/faq',
  'help/normative',
  'help/instructions',
  'help/videos',
  'help/services',
  'help/agreements',
  'self-check',
  'self-check/hiring',
  'news',
  'news/ectd-deadline-liability',
];

for (const path of SITE_PAGES) {
  test(`IR-UI-07: /ru/${path} has one h1 and no axe violations`, async ({ page }) => {
    await page.goto(`/ru/${path}`);

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await findUnexpectedAxeViolations(page)).toEqual([]);
  });

  test(`IR-UI-07: /ru/${path} reflows at 320 px without horizontal scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(`/ru/${path}`);

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
}

test('help search filters the section content by the query', async ({ page }) => {
  await page.goto('/ru/help/instructions');

  await page.getByRole('searchbox', { name: 'Поиск по разделу' }).fill('БИН');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/q=%D0%91%D0%98%D0%9D/u);
  await expect(page.getByRole('main').getByRole('heading', { level: 3 })).toHaveText(['Смена БИН при реорганизации']);
});

test('help audience filter keeps only the chosen audience', async ({ page }) => {
  await page.goto('/ru/help/videos');

  await page.getByRole('navigation', { name: 'Для кого' }).getByRole('link', { name: 'Работнику' }).click();

  await expect(page).toHaveURL(/audience=employee/u);
  await expect(page.getByRole('main').getByRole('article').getByText('Работодателю', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('article')).toHaveCount(3);
});

test('self-check: answering every question shows the result with recommendations', async ({ page }) => {
  await page.goto('/ru/self-check/hiring');

  const answers = ['Да', 'Да', 'Нет', 'Нет', 'Да', 'Нет', 'Не знаю', 'Нет'];
  for (const [index, answer] of answers.entries()) {
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: index === answers.length - 1 ? 'Результат' : 'Далее' }).click();
  }

  await expect(page.getByRole('heading', { name: 'Найдены вероятные нарушения' })).toBeVisible();
  await expect(page.getByText('В договорах нет обязательных условий')).toBeVisible();
  await expect(page.getByText('Проверьте испытательный срок')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Найдены вероятные нарушения' })).toBeFocused();
  expect(await findUnexpectedAxeViolations(page)).toEqual([]);
});

test('FR-MAIN-50: the news feed is paged and opens the full text', async ({ page }) => {
  await page.goto('/ru/news');

  await expect(page.getByRole('main').getByRole('article')).toHaveCount(9);
  await page.getByRole('navigation', { name: 'Страницы новостей' }).getByRole('link', { name: 'Страница 2' }).click();
  await expect(page).toHaveURL(/page=2/u);
  await expect(page.getByRole('main').getByRole('article')).toHaveCount(1);

  await page.getByRole('link', { name: 'Подписание ЭТД через eGov Mobile Business' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Подписание ЭТД через eGov Mobile Business');
});

test('news category filter keeps only the chosen category', async ({ page }) => {
  await page.goto('/ru/news');

  await page.getByRole('navigation', { name: 'Рубрики новостей' }).getByRole('link', { name: 'Мероприятия' }).click();

  await expect(page).toHaveURL(/category=events/u);
  await expect(page.getByRole('main').getByRole('article')).toHaveCount(1);
});

test.describe('desktop header', () => {
  test.use({ viewport: { width: 1440, height: 900 }, isMobile: false });

  test('IR-UI-07: the help menu opens and closes from the keyboard', async ({ page }) => {
    await page.goto('/ru');

    const trigger = page.getByRole('navigation', { name: 'Основная навигация' }).locator('summary');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('link', { name: 'Нормативные акты' }).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('link', { name: 'Нормативные акты' }).first()).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
