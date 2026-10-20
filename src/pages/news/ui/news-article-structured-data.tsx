import type { NewsArticle } from '@/entities/news';

type NewsArticleStructuredDataProps = Readonly<{
  article: NewsArticle;
  url: string;
}>;

const ESCAPED_LESS_THAN = String.fromCodePoint(0x5c, 0x75, 0x30, 0x30, 0x33, 0x63);

const toJsonLd = (value: object) => JSON.stringify(value).replaceAll('<', ESCAPED_LESS_THAN);

export function NewsArticleStructuredData({ article, url }: NewsArticleStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.seo.description ?? article.lead,
    datePublished: article.publishedAt,
    inLanguage: article.language.lang,
    mainEntityOfPage: url,
    ...(article.cover === undefined ? {} : { image: [article.cover.url] }),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- JSON-LD must be inline JSON; "<" is escaped so the content cannot close the script tag
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
    />
  );
}
