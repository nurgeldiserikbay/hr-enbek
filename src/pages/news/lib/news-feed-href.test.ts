import { newsFeedHref, parseNewsPage } from './news-feed-href.ts';

describe('newsFeedHref', () => {
  it('links to the plain feed without filters', () => {
    expect(newsFeedHref('/news', { query: undefined, category: undefined, page: 1 })).toBe('/news');
  });

  it('keeps the query and category and omits the first page', () => {
    expect(newsFeedHref('/news', { query: 'ЕСУТД', category: 'services', page: 1 })).toBe(
      '/news?q=%D0%95%D0%A1%D0%A3%D0%A2%D0%94&category=services',
    );
    expect(newsFeedHref('/news', { query: undefined, category: undefined, page: 3 })).toBe('/news?page=3');
  });
});

describe('parseNewsPage', () => {
  it('falls back to the first page for invalid values', () => {
    expect(parseNewsPage('2')).toBe(2);
    expect(parseNewsPage()).toBe(1);
    expect(parseNewsPage('0')).toBe(1);
    expect(parseNewsPage('1.5')).toBe(1);
    expect(parseNewsPage(['2'])).toBe(1);
  });
});
