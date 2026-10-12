import type { Metadata } from 'next';

import { getNewsArticle } from '@/entities/news';
import { NewsArticlePage } from '@/pages/news';
import { resolveLocale } from '@/shared/config';

type NewsArticleRouteProps = Readonly<PageProps<'/[locale]/news/[id]'>>;

export async function generateMetadata({ params }: NewsArticleRouteProps): Promise<Metadata> {
  await resolveLocale(params);
  const { id } = await params;
  const article = await getNewsArticle(id);
  return article === undefined ? {} : { title: article.title, description: article.excerpt };
}

export default async function Page({ params }: NewsArticleRouteProps) {
  await resolveLocale(params);
  const { id } = await params;
  return <NewsArticlePage articleId={id} />;
}
