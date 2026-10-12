import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { HelpPage, parseHelpSection } from '@/pages/help';
import { parseAudience, resolveLocale } from '@/shared/config';
import { readSearchParam } from '@/shared/lib/search';

type HelpRouteProps = Readonly<PageProps<'/[locale]/help/[section]'>>;

export async function generateMetadata({ params }: HelpRouteProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { section: segment } = await params;
  const section = parseHelpSection(segment);
  if (section === undefined) return {};
  const t = await getTranslations({ locale, namespace: 'HelpPage' });
  return { title: t(`sections.${section}.title`) };
}

export default async function Page({ params, searchParams }: HelpRouteProps) {
  await resolveLocale(params);
  const { section: segment } = await params;
  const section = parseHelpSection(segment);
  if (section === undefined) notFound();
  const query = await searchParams;

  return (
    <HelpPage
      section={section}
      filters={{
        query: readSearchParam(query['q']),
        audience: parseAudience(query['audience']),
        category: readSearchParam(query['category']),
      }}
    />
  );
}
