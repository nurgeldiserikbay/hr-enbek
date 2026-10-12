import { CircleCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Link, ROUTES } from '@/shared/config';
import { cn } from '@/shared/lib/styles';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ArrowLeftRight, ArrowRight, Database, FilePen, FileText, Network, RefreshCw } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';

const CHECKLIST_KEYS = ['registry', 'signing', 'anySize'] as const;

const FLOW = [
  { key: 'hrSystem', icon: <Database /> },
  { key: 'integration', icon: <ArrowLeftRight /> },
  { key: 'ectd', icon: <Network /> },
] as const;

type ServiceCardProps = Readonly<{
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  text: string;
  children: ReactNode;
}>;

function ServiceCard({ id, icon, title, subtitle, text, children }: ServiceCardProps) {
  return (
    <Card asChild className="p-4 lg:px-9 lg:pt-10 lg:pb-11">
      <section aria-labelledby={id}>
        <div className="flex items-center gap-4">
          <IconTile size="md">{icon}</IconTile>
          <div>
            <h2 id={id} className="text-h4 text-text-heading lg:text-h3">
              {title}
            </h2>
            <p className="text-body-m text-text-body">{subtitle}</p>
          </div>
        </div>
        <p className="mt-5 text-body-m text-text-body lg:mt-6 lg:text-body-l">{text}</p>
        <div className="mt-5">{children}</div>
      </section>
    </Card>
  );
}

export function ServicesContent() {
  const t = useTranslations('HelpPage.services');

  return (
    <div className="flex flex-col gap-6">
      <ServiceCard
        id="service-registration"
        icon={<FilePen />}
        title={t('registration.title')}
        subtitle={t('registration.subtitle')}
        text={t('registration.text')}
      >
        <ul className="flex flex-col gap-3 lg:gap-5">
          {CHECKLIST_KEYS.map((key) => (
            <li key={key} className="flex items-center gap-3 text-body-l-medium text-text-heading">
              <CircleCheck
                aria-hidden="true"
                className="size-5 shrink-0 fill-brand-primary text-surface-card lg:size-[22px]"
              />
              {t(`registration.${key}`)}
            </li>
          ))}
        </ul>
      </ServiceCard>

      <ServiceCard
        id="service-sync"
        icon={<RefreshCw />}
        title={t('sync.title')}
        subtitle={t('sync.subtitle')}
        text={t('sync.text')}
      >
        <ol className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-3">
          {FLOW.map(({ key, icon }, index) => (
            <li key={key} className="contents">
              <div
                className={cn(
                  'rounded-xl p-4 lg:px-5 lg:pt-8 lg:pb-6 [&>svg]:size-5',
                  index === FLOW.length - 1
                    ? 'bg-brand-primary text-text-inverse'
                    : 'bg-surface-page text-brand-primary',
                )}
              >
                {icon}
                <p
                  className={cn(
                    'mt-3 text-body-l-medium',
                    index === FLOW.length - 1 ? 'text-text-inverse' : 'text-text-heading',
                  )}
                >
                  {t(`sync.${key}.title`)}
                </p>
                <p
                  className={cn(
                    'mt-1 text-body-s lg:mt-2 lg:text-body-m',
                    index === FLOW.length - 1 ? 'text-text-inverse' : 'text-text-body',
                  )}
                >
                  {t(`sync.${key}.text`)}
                </p>
              </div>
              {index < FLOW.length - 1 && (
                <ArrowRight aria-hidden="true" className="mx-auto hidden size-4 text-text-muted lg:block" />
              )}
            </li>
          ))}
        </ol>
        <Button asChild className="mt-5 h-10 px-4 text-body-s-medium">
          <Link href={ROUTES.helpInstructions}>
            <FileText aria-hidden="true" className="size-4" />
            {t('sync.documentation')}
          </Link>
        </Button>
      </ServiceCard>
    </div>
  );
}
