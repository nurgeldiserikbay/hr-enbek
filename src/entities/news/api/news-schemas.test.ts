import { newsArticleSchema, newsFeedSchema } from './news-schemas.ts';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const item = {
  slug: 'novye-servisy',
  category: { code: 'services', name: 'Сервистер', langUsed: 'kk' },
  title: 'New services for employers',
  summary: 'Жұмыс берушілерге арналған жаңа қызметтер',
  publishedAt: '2026-03-12T04:00:00Z',
  readingMinutes: 3,
  isPinned: true,
  cover: null,
  coverAlt: null,
  langUsed: 'en',
  fallbackFields: ['summary'],
};

describe('newsFeedSchema', () => {
  it('turns the zero-based CMS page into the page number shown on the site', () => {
    const feed = newsFeedSchema.parse({ content: [item], page: 0, size: 9, totalElements: 1, totalPages: 1 });

    expect(feed.page).toBe(1);
    expect(feed.pageCount).toBe(1);
    expect(feed.items[0]).toEqual({
      slug: 'novye-servisy',
      title: 'New services for employers',
      excerpt: 'Жұмыс берушілерге арналған жаңа қызметтер',
      publishedAt: '2026-03-12T04:00:00Z',
      readingMinutes: 3,
      isPinned: true,
      category: { id: 'services', title: 'Сервистер', lang: 'kk' },
      cover: undefined,
      language: { lang: 'en', fallbackFields: ['summary'] },
    });
  });

  it('IR-UI-03: treats an unknown or missing language as Kazakh', () => {
    const feed = newsFeedSchema.parse({
      content: [{ ...item, langUsed: 'de', fallbackFields: undefined, summary: '  ', category: null }],
      page: 1,
      totalPages: 3,
    });

    expect(feed.items[0]?.language).toEqual({ lang: 'kk', fallbackFields: [] });
    expect(feed.items[0]?.excerpt).toBeUndefined();
    expect(feed.items[0]?.category).toBeUndefined();
  });
});

describe('newsArticleSchema', () => {
  it('keeps the editor document, SEO texts and the languages the article is written in', () => {
    const body = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Мәтін' }] }] };

    const article = newsArticleSchema.parse({
      ...item,
      subtitle: 'Кіріспе',
      body,
      seo: { title: null, description: 'Сипаттама' },
      languages: ['kk', 'ru', 'de'],
      related: [item],
      cover: {
        id: '0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
        url: 'https://cms.example/cms/api/v1/public/files/0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
        width: 1600,
        height: 900,
        thumbnailUrl: null,
      },
      coverAlt: 'Подписание договора',
    });

    expect(article.lead).toBe('Кіріспе');
    expect(article.body).toEqual(body);
    expect(article.seo).toEqual({ title: undefined, description: 'Сипаттама' });
    expect(article.languages).toEqual(['kk', 'ru']);
    expect(article.related).toHaveLength(1);
    expect(article.cover).toEqual({
      url: 'https://cms.example/cms/api/v1/public/files/0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
      width: 1600,
      height: 900,
      thumbnailUrl: undefined,
      alt: 'Подписание договора',
    });
  });

  it('FR-MAIN-05: rejects an HTML body instead of the editor document', () => {
    expect(newsArticleSchema.safeParse({ ...item, body: '<p>html</p>', languages: ['kk'] }).success).toBe(false);
  });
});
