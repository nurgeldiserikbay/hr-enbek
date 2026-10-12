import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { getAgreements } from '@/entities/agreements';
import { getFaq } from '@/entities/faqs';
import { getInstructions } from '@/entities/instructions';
import { getLabourInspections } from '@/entities/labour-inspections';
import { getLegalDocuments } from '@/entities/legal-documents';
import { getVideos } from '@/entities/videos';
import { type Audience, MAIN_CONTENT_ID } from '@/shared/config';
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

async function renderSection(section: HelpSection, { query, audience, category }: HelpFilters): Promise<ReactNode> {
  switch (section) {
    case 'faq': {
      return <FaqContent categories={await getFaq(query)} category={category} query={query} />;
    }
    case 'normative': {
      return <NormativeContent groups={await getLegalDocuments(query)} />;
    }
    case 'instructions': {
      return (
        <InstructionsContent
          instructions={await getInstructions({ query, audience })}
          audience={audience}
          query={query}
        />
      );
    }
    case 'videos': {
      return <VideosContent videos={await getVideos({ query, audience })} audience={audience} query={query} />;
    }
    case 'services': {
      return <ServicesContent />;
    }
    case 'agreements': {
      return <AgreementsContent agreements={await getAgreements(query)} />;
    }
  }
}

type HelpPageProps = Readonly<{
  section: HelpSection;
  filters: HelpFilters;
}>;

export async function HelpPage({ section, filters }: HelpPageProps) {
  const t = await getTranslations('HelpPage');
  const [content, inspections] = await Promise.all([renderSection(section, filters), getLabourInspections()]);

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
