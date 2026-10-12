import { useTranslations } from 'next-intl';

import type { Instruction } from '@/entities/instructions';
import type { Audience } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { ContentIcon } from '@/shared/ui/content-icon';
import { FeatureCard } from '@/shared/ui/feature-card';
import { Download, FileText } from '@/shared/ui/icon';

import { AudienceFilter } from './audience-filter.tsx';
import { AudienceTag } from './audience-tag.tsx';
import { EmptyResult } from './empty-result.tsx';

type InstructionsContentProps = Readonly<{
  instructions: readonly Instruction[];
  audience: Audience | undefined;
  query: string | undefined;
}>;

export function InstructionsContent({ instructions, audience, query }: InstructionsContentProps) {
  const t = useTranslations('HelpPage');

  return (
    <div className="flex flex-col gap-6">
      <AudienceFilter section="instructions" audience={audience} query={query} />
      {instructions.length === 0 && <EmptyResult />}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {instructions.map((instruction) => (
          <FeatureCard
            key={instruction.id}
            descriptionSize="lg"
            icon={<ContentIcon name={instruction.icon} />}
            title={instruction.title}
            description={instruction.description}
            badge={<AudienceTag audience={instruction.audience} />}
          >
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" className="h-10 px-4 font-normal">
                <a href={instruction.pdfUrl} download>
                  <Download aria-hidden="true" className="size-4" />
                  {t('downloadPdf')}
                  <span className="sr-only">: {instruction.title}</span>
                </a>
              </Button>
              <Button asChild variant="secondary" size="sm" className="h-10 px-4 font-normal">
                <a href={instruction.url}>
                  <FileText aria-hidden="true" className="size-4" />
                  {t('open')}
                  <span className="sr-only">: {instruction.title}</span>
                </a>
              </Button>
            </div>
          </FeatureCard>
        ))}
      </div>
    </div>
  );
}
