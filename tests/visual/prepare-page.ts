import type { Page } from '@playwright/test';

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

const HIDE_DEV_OVERLAY = 'nextjs-portal { display: none !important; }';

export async function preparePage(page: Page) {
  await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images].map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener('load', resolve);
            }),
      ),
    );
    await document.fonts.ready;
  });
}
