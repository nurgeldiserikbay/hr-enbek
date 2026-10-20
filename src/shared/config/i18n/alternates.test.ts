import { localizedAlternates } from './alternates.ts';

describe('localizedAlternates', () => {
  it('points every page to its own address in each language', () => {
    expect(localizedAlternates('ru', '/news')).toEqual({
      canonical: '/ru/news',
      languages: { kk: '/kk/news', ru: '/ru/news', en: '/en/news', 'x-default': '/kk/news' },
    });
  });

  it('uses the language root for the home page', () => {
    expect(localizedAlternates('kk', '/').canonical).toBe('/kk');
  });

  it('IR-UI-03: sends a page without its own translation to the Kazakh original', () => {
    expect(localizedAlternates('en', '/news/a', ['kk', 'ru'])).toEqual({
      canonical: '/kk/news/a',
      languages: { kk: '/kk/news/a', ru: '/ru/news/a', 'x-default': '/kk/news/a' },
    });
  });
});
