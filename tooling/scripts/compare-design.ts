import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, type Page } from '@playwright/test';

import { preparePage, VIEWPORTS } from '../../tests/visual/prepare-page.ts';
import { DESIGN_PAGES, type Rect } from './compare-design.config.ts';
import { renderReport, type ReportResult, type ReportViewport } from './compare-design.report.ts';

const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:3000';
const THRESHOLD = Number(process.env['THRESHOLD'] ?? 8);
const RADIUS = Number(process.env['RADIUS'] ?? 1);
const DESIGN_DIR = path.resolve('../design/screens');
const OUT_DIR = path.resolve('design-diff');
const REPORT_PATH = path.join(OUT_DIR, 'index.html');

const toDataUrl = (png: Buffer) => `data:image/png;base64,${png.toString('base64')}`;

const measure = (page: Page, selector: string): Promise<Rect> =>
  page.$$eval(selector, (elements) => {
    const rects = elements.map((element) => element.getBoundingClientRect());
    const top = Math.min(...rects.map((rect) => rect.top)) + window.scrollY;
    const left = Math.min(...rects.map((rect) => rect.left));
    const bottom = Math.max(...rects.map((rect) => rect.bottom)) + window.scrollY;
    const right = Math.max(...rects.map((rect) => rect.right));
    return {
      x: Math.round(left),
      y: Math.round(top),
      width: Math.round(right - left),
      height: Math.round(bottom - top),
    };
  });

const measureLayout = (page: Page) =>
  page.evaluate(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping -- runs inside page.evaluate, outer scope is not available in the browser
    const toRect = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.left),
        y: Math.round(rect.top + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    };
    // eslint-disable-next-line unicorn/consistent-function-scoping -- runs inside page.evaluate, outer scope is not available in the browser
    const label = (element: Element, fallback: string) =>
      (element.querySelector('h1, h2, h3')?.textContent ?? fallback).trim().slice(0, 40);
    const main = document.querySelector('main');
    const containers = main
      ? [...main.children].flatMap((child) =>
          child.matches('div.page-container') && child.children.length > 1 ? [...child.children] : [child],
        )
      : [];
    const parts = [
      ...[...document.querySelectorAll('header')].slice(0, 1).map((element) => ({ name: 'Шапка', element })),
      ...containers.map((element, index) => ({ name: label(element, `Блок ${String(index + 1)}`), element })),
      ...[...document.querySelectorAll('footer')].slice(0, 1).map((element) => ({ name: 'Подвал', element })),
    ];
    return parts
      .filter(({ element }) => element.getBoundingClientRect().height > 20)
      .map(({ name, element }) => ({ name, design: null, page: toRect(element) }));
  });

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const viewports: ReportViewport[] = [];

for (const designPage of DESIGN_PAGES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    const key = viewportName as keyof typeof VIEWPORTS;
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}${designPage.path}`, { waitUntil: 'networkidle' });
    for (const answer of designPage.answers ?? []) {
      await page.getByRole('radio', { name: answer, exact: true }).check();
      await page.getByRole('button', { name: /Далее|Результат/u }).click();
    }
    if (designPage.select !== undefined) {
      await page.getByRole('radio', { name: designPage.select, exact: true }).check();
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });
    }
    await preparePage(page);
    const fixedBlocks = await Promise.all(
      (designPage.blocks ?? []).map(async ({ name, selector, design }) => ({
        name,
        design: design?.[key] ?? null,
        page: await measure(page, selector),
      })),
    );
    const autoBlocks = designPage.blocks === undefined ? await measureLayout(page) : [];
    const blocks = [...fixedBlocks, ...autoBlocks];
    const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
    mkdirSync(path.join(OUT_DIR, 'shots'), { recursive: true });
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- file name is built from the page index in compare-design.config.ts
    writeFileSync(
      path.join(OUT_DIR, 'shots', `${String(DESIGN_PAGES.indexOf(designPage))}-${viewportName}.png`),
      screenshot,
    );
    await page.close();
    viewports.push({
      title: `${designPage.name} · ${viewportName} ${String(viewport.width)}px`,
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- file names come from compare-design.config.ts
      designImage: toDataUrl(readFileSync(path.join(DESIGN_DIR, designPage.designs[key]))),
      pageImage: toDataUrl(screenshot),
      blocks,
    });
  }
}

writeFileSync(
  REPORT_PATH,
  renderReport(viewports, {
    subtitle: `${BASE_URL} · ${new Date().toLocaleString('ru-RU')}`,
    threshold: THRESHOLD,
    radius: RADIUS,
  }),
);

const report = await browser.newPage();
await report.goto(pathToFileURL(REPORT_PATH).href);
const handle = await report.waitForFunction(() => (globalThis as { comparisonResults?: unknown }).comparisonResults, {
  timeout: 120_000,
});
const results = (await handle.jsonValue()) as ReportResult[];
await browser.close();

for (const title of new Set(results.map((result) => result.title))) {
  console.log(`\n${title}`);
  console.table(
    results
      .filter((result) => result.title === title)
      .map(({ name, dy, dh, percent }) => ({
        block: name,
        'Δ y px': dy,
        'Δ height px': dh,
        'diff %': Number(percent.toFixed(2)),
      })),
  );
}
console.log(
  `Threshold: channel difference > ${String(THRESHOLD)}, anti-aliasing radius ${String(RADIUS)} px. Report: ${REPORT_PATH}`,
);
