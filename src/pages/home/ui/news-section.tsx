import { useTranslations } from 'next-intl';

import { NewsCard, type NewsPreview } from '@/entities/news';
import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { CarouselSection } from '@/shared/ui/carousel-section';

type NewsSectionProps = Readonly<{
  news: readonly NewsPreview[];
}>;

export function NewsSection({ news }: NewsSectionProps) {
  const t = useTranslations('HomePage.news');

  return (
    <CarouselSection
      className="lg:bg-surface-soft lg:pt-[27px] lg:pb-7"
      titleClassName="lg:tracking-normal"
      descriptionClassName="lg:mt-0.75"
      listClassName="lg:mt-6"
      title={t('titleStart')}
      accent={t('titleAccent')}
      description={t('description')}
      previousLabel={t('previous')}
      nextLabel={t('next')}
      itemClassName="w-full max-w-[20.875rem] lg:w-[21.8125rem] lg:max-w-none"
      items={news.map((item) => ({ key: item.slug, node: <NewsCard news={item} className="w-full" /> }))}
      actions={
        <Button asChild className="h-10 w-[13.375rem] shrink-0 text-body-l font-normal lg:w-auto lg:px-6">
          <Link href={ROUTES.news}>{t('all')}</Link>
        </Button>
      }
    />
  );
}
