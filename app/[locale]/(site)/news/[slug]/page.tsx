import type { Metadata } from 'next';

import { getNewsArticle } from '@/entities/news';
import { NewsArticlePage } from '@/pages/news';
import { localizedAlternates, newsArticleRoute, resolveLocale } from '@/shared/config';

type NewsArticleRouteProps = Readonly<PageProps<'/[locale]/news/[slug]'>>;

export async function generateMetadata({ params }: NewsArticleRouteProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const article = await getNewsArticle(locale, slug);
  if (article === undefined) return {};
  const title = article.seo.title ?? article.title;
  const description = article.seo.description ?? article.lead;

  return {
    title,
    description,
    alternates: localizedAlternates(locale, newsArticleRoute(article.slug), article.languages),
    openGraph: {
      type: 'article',
      title,
      description,
      locale,
      publishedTime: article.publishedAt,
      ...(article.cover === undefined
        ? {}
        : {
            images: [
              {
                url: article.cover.url,
                alt: article.cover.alt,
                ...(article.cover.width === undefined ? {} : { width: article.cover.width }),
                ...(article.cover.height === undefined ? {} : { height: article.cover.height }),
              },
            ],
          }),
    },
  };
}

export default async function Page({ params }: NewsArticleRouteProps) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  return <NewsArticlePage locale={locale} slug={slug} />;
}
