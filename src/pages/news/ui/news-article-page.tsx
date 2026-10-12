import { Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

import { getLabourInspections } from '@/entities/labour-inspections';
import { getLatestNews, getNewsArticle, NewsDate } from '@/entities/news';
import { ShareLinks } from '@/features/share-link';
import { env, Link, MAIN_CONTENT_ID, newsArticleRoute, ROUTES } from '@/shared/config';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Card } from '@/shared/ui/card';
import { ArrowLeft, Clock } from '@/shared/ui/icon';
import { RichText } from '@/shared/ui/rich-text';
import { Tag } from '@/shared/ui/tag';
import { LabourInspection } from '@/widgets/labour-inspection';

import { OtherNews } from './other-news.tsx';
import { SelfCheckPromo } from './self-check-promo.tsx';

const OTHER_NEWS_COUNT = 3;

type NewsArticlePageProps = Readonly<{
  articleId: string;
}>;

export async function NewsArticlePage({ articleId }: NewsArticlePageProps) {
  const [article, otherNews, inspections, locale, t] = await Promise.all([
    getNewsArticle(articleId),
    getLatestNews({ limit: OTHER_NEWS_COUNT, excludeId: articleId }),
    getLabourInspections(),
    getLocale(),
    getTranslations('NewsArticlePage'),
  ]);
  if (article === undefined) notFound();

  const articleUrl = new URL(`/${locale}${newsArticleRoute(article.id)}`, env.NEXT_PUBLIC_SITE_URL).toString();

  return (
    <main id={MAIN_CONTENT_ID} className="page-container pt-6 pb-12 lg:pt-14 lg:pb-25">
      <Breadcrumbs
        className="hidden lg:block"
        label={t('breadcrumbs')}
        items={[
          { label: t('home'), href: ROUTES.home },
          { label: t('news'), href: ROUTES.news },
          { label: article.title },
        ]}
      />
      <Link
        href={ROUTES.news}
        className="inline-flex items-center gap-2 text-body-m-semibold text-brand-primary-text lg:hidden"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t('allNews')}
      </Link>

      <div className="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[1fr_27.5rem]">
        <Card asChild className="p-4 lg:p-10">
          <article>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body-s text-text-muted">
              {article.category !== undefined && <Tag>{article.category.title}</Tag>}
              <span className="inline-flex items-center gap-1.5">
                <Calendar aria-hidden="true" className="size-4" />
                <NewsDate value={article.publishedAt} />
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="size-4" />
                {t('readingTime', { minutes: article.readingMinutes })}
              </span>
            </div>
            <h1 className="mt-4 text-h2-xs leading-8 text-text-heading lg:mt-6 lg:text-h2 lg:leading-11">
              {article.title}
            </h1>
            <p className="mt-4 text-body-m leading-6.5 text-text-body lg:mt-6 lg:text-h5 lg:leading-7 lg:font-normal">
              {article.excerpt}
            </p>
            <RichText className="mt-6" html={article.body} />
            <footer className="mt-6 flex items-center justify-between gap-4 border-t border-border-default pt-6">
              <ShareLinks url={articleUrl} title={article.title} />
              <Link
                href={ROUTES.news}
                className="hidden items-center gap-2 text-body-m-semibold text-brand-primary hover:underline lg:inline-flex"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                {t('allNews')}
              </Link>
            </footer>
          </article>
        </Card>

        <div className="flex flex-col gap-4 lg:gap-6">
          {otherNews.length > 0 && <OtherNews news={otherNews} />}
          <SelfCheckPromo />
        </div>
      </div>

      <div className="mt-12 lg:mt-8">
        <LabourInspection inspections={inspections} />
      </div>
    </main>
  );
}
