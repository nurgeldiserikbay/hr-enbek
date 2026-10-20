import { render } from '@testing-library/react';

import type { NewsArticle } from '@/entities/news';

import { NewsArticleStructuredData } from './news-article-structured-data.tsx';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const article: NewsArticle = {
  slug: 'a',
  title: 'Заголовок</script><script>alert(1)</script>',
  lead: 'Анонс',
  body: { type: 'doc', content: [] },
  publishedAt: '2026-03-12T04:00:00Z',
  readingMinutes: 1,
  category: undefined,
  isPinned: false,
  cover: {
    url: 'https://cms.example/cms/api/v1/public/files/1',
    width: 1600,
    height: 900,
    thumbnailUrl: undefined,
    alt: 'Обложка',
  },
  seo: { title: undefined, description: undefined },
  languages: ['kk', 'ru'],
  related: [],
  language: { lang: 'ru', fallbackFields: [] },
};

describe('NewsArticleStructuredData', () => {
  it('FR-MAIN-05: keeps a title with markup inside the JSON-LD script', () => {
    const { container } = render(<NewsArticleStructuredData article={article} url="https://hr.enbek.kz/ru/news/a" />);

    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(1);
    expect(scripts[0]?.innerHTML).not.toContain('<');
    expect(JSON.parse(scripts[0]?.innerHTML ?? '')).toMatchObject({
      '@type': 'NewsArticle',
      headline: article.title,
      description: 'Анонс',
      inLanguage: 'ru',
    });
  });
});
