import { CircleCheck } from 'lucide-react';

import type { Service } from '@/entities/services';
import { fieldLanguage } from '@/shared/api';
import { cn } from '@/shared/lib/styles';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ContentIcon } from '@/shared/ui/content-icon';
import { ContentLink } from '@/shared/ui/content-link';
import { ArrowRight, FileText } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';

import { EmptyResult } from './empty-result.tsx';

function ServiceFlow({ flow }: Readonly<{ flow: Service['flow'] }>) {
  return (
    <ol className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
      {flow.map(({ icon, title, text }, index) => {
        const isLast = index === flow.length - 1;
        return (
          <li key={`${String(index)}-${title}`} className="contents">
            <div
              className={cn(
                'rounded-xl p-4 lg:flex-1 lg:self-stretch lg:px-5 lg:pt-8 lg:pb-6 [&>svg]:size-5',
                isLast ? 'bg-brand-primary text-text-inverse' : 'bg-surface-page text-brand-primary',
              )}
            >
              <ContentIcon name={icon} />
              <p className={cn('mt-3 text-body-l-medium', isLast ? 'text-text-inverse' : 'text-text-heading')}>
                {title}
              </p>
              {text !== undefined && (
                <p
                  className={cn(
                    'mt-1 text-body-s lg:mt-2 lg:text-body-m',
                    isLast ? 'text-text-inverse' : 'text-text-body',
                  )}
                >
                  {text}
                </p>
              )}
            </div>
            {!isLast && (
              <ArrowRight aria-hidden="true" className="mx-auto hidden size-4 shrink-0 text-text-muted lg:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ServiceCard({ service }: Readonly<{ service: Service }>) {
  const { id, icon, title, subtitle, description, features, flow, action, language } = service;
  const headingId = `service-${id}`;
  const actionLang = fieldLanguage(language, 'action');

  return (
    <Card asChild className="p-4 lg:px-9 lg:pt-10 lg:pb-11">
      <section aria-labelledby={headingId} lang={language.lang}>
        <div className="flex items-center gap-4">
          <IconTile size="md">
            <ContentIcon name={icon} />
          </IconTile>
          <div>
            <h2 id={headingId} className="text-h4 text-text-heading lg:text-h3">
              {title}
            </h2>
            {subtitle !== undefined && (
              <p lang={fieldLanguage(language, 'subtitle')} className="text-body-m text-text-body">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {description !== undefined && (
          <p
            lang={fieldLanguage(language, 'description')}
            className="mt-5 text-body-m text-text-body lg:mt-6 lg:text-body-l"
          >
            {description}
          </p>
        )}
        {features.length > 0 && (
          <ul lang={fieldLanguage(language, 'features')} className="mt-5 flex flex-col gap-3 lg:gap-5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-body-l-medium text-text-heading">
                <CircleCheck
                  aria-hidden="true"
                  className="size-5 shrink-0 fill-brand-primary text-surface-card lg:size-[22px]"
                />
                {feature}
              </li>
            ))}
          </ul>
        )}
        {flow.length > 0 && (
          <div lang={fieldLanguage(language, 'flow')} className="mt-5">
            <ServiceFlow flow={flow} />
          </div>
        )}
        {action !== undefined && (
          <Button asChild className="mt-5 h-10 px-4 text-body-s-medium">
            <ContentLink href={action.href} lang={actionLang}>
              <FileText aria-hidden="true" className="size-4" />
              {action.label}
            </ContentLink>
          </Button>
        )}
      </section>
    </Card>
  );
}

type ServicesContentProps = Readonly<{
  services: readonly Service[];
}>;

export function ServicesContent({ services }: ServicesContentProps) {
  if (services.length === 0) return <EmptyResult />;

  return (
    <div className="flex flex-col gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
