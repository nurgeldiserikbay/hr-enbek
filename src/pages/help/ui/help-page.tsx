import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { getAgreements } from '@/entities/agreements';
import { getFaq, getFaqTopics } from '@/entities/faqs';
import { getInstructions } from '@/entities/instructions';
import { getLabourInspections } from '@/entities/labour-inspections';
import { getLegalDocuments } from '@/entities/legal-documents';
import { getServices } from '@/entities/services';
import { getVideos } from '@/entities/videos';
import { type Audience, type Locale, MAIN_CONTENT_ID } from '@/shared/config';
import { Card } from '@/shared/ui/card';
import { SearchField } from '@/shared/ui/search-field';
import { LabourInspection } from '@/widgets/labour-inspection';
import { SupportCard } from '@/widgets/support-card';

import type { HelpSection } from '../config/sections.ts';
import { AgreementsContent } from './agreements-content.tsx';
import { FaqContent } from './faq-content.tsx';
import { HelpNavigation } from './help-navigation.tsx';
import { InstructionsContent } from './instructions-content.tsx';
import { NormativeContent } from './normative-content.tsx';
import { ServicesContent } from './services-content.tsx';
import { VideosContent } from './videos-content.tsx';

interface HelpFilters {
  query: string | undefined;
  audience: Audience | undefined;
  category: string | undefined;
}

async function renderFaq(locale: Locale, { query, category }: HelpFilters): Promise<ReactNode> {
  const [topics, categories] = await Promise.all([getFaqTopics(locale), getFaq(locale, query)]);
  return <FaqContent topics={topics} categories={categories} category={category} query={query} />;
}

async function renderSection(section: HelpSection, locale: Locale, filters: HelpFilters): Promise<ReactNode> {
  const { query, audience } = filters;
  switch (section) {
    case 'faq': {
      return renderFaq(locale, filters);
    }
    case 'normative': {
      return <NormativeContent groups={await getLegalDocuments(locale, query)} />;
    }
    case 'instructions': {
      return (
        <InstructionsContent
          instructions={await getInstructions({ locale, query, audience })}
          audience={audience}
          query={query}
        />
      );
    }
    case 'videos': {
      return <VideosContent videos={await getVideos({ locale, query, audience })} audience={audience} query={query} />;
    }
    case 'services': {
      return <ServicesContent services={await getServices(locale)} />;
    }
    case 'agreements': {
      return <AgreementsContent agreements={await getAgreements(locale, query)} />;
    }
  }
}

type HelpPageProps = Readonly<{
  locale: Locale;
  section: HelpSection;
  filters: HelpFilters;
}>;

export async function HelpPage({ locale, section, filters }: HelpPageProps) {
  const t = await getTranslations('HelpPage');
  const [content, inspections] = await Promise.all([
    renderSection(section, locale, filters),
    getLabourInspections(locale),
  ]);

  return (
    <main id={MAIN_CONTENT_ID} className="page-container flex flex-col gap-10 pt-6 pb-10 lg:gap-12 lg:pt-14 lg:pb-12.5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_25.625rem] lg:gap-6">
        <Card className="flex flex-col p-4 lg:p-8">
          <h1 className="text-h2-xs text-text-heading lg:text-h1-sm">{t(`sections.${section}.title`)}</h1>
          <p className="mt-3 text-body-l text-text-body lg:mt-5">{t(`sections.${section}.description`)}</p>
          <SearchField
            className="mt-6 lg:mt-auto lg:pt-10"
            label={t('searchLabel')}
            placeholder={t('searchPlaceholder')}
            {...(filters.query === undefined ? {} : { defaultValue: filters.query })}
          />
        </Card>
        <SupportCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:mt-2 lg:grid-cols-[18.75rem_1fr] lg:gap-6">
        <HelpNavigation />
        <div>{content}</div>
      </div>

      <LabourInspection inspections={inspections} />
    </main>
  );
}
