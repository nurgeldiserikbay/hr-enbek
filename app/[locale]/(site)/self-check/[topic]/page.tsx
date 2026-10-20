import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getSelfCheckTopic } from '@/entities/self-checks';
import { SelfCheckTopicPage } from '@/pages/self-check';
import { localizedAlternates, resolveLocale, selfCheckTopicRoute } from '@/shared/config';

type TopicRouteProps = Readonly<PageProps<'/[locale]/self-check/[topic]'>>;

export async function generateMetadata({ params }: TopicRouteProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'PageTitles' });
  const { topic } = await params;
  const data = await getSelfCheckTopic(topic);
  return {
    title: data === undefined ? t('selfCheck') : t('selfCheckTopic', { topic: data.title }),
    alternates: localizedAlternates(locale, selfCheckTopicRoute(topic)),
  };
}

export default async function Page({ params }: TopicRouteProps) {
  await resolveLocale(params);
  const { topic } = await params;
  return <SelfCheckTopicPage topicId={topic} />;
}
