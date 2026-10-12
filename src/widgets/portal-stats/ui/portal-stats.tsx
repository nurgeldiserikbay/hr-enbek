import { useFormatter, useTranslations } from 'next-intl';

import type { PortalStats as PortalStatsData } from '@/entities/portal-stats';
import { Card } from '@/shared/ui/card';

const COMPACT_FROM = 1_000_000;

const STATS = [
  { key: 'contracts', placement: 'lg:w-52 lg:justify-self-start' },
  { key: 'employers', placement: 'lg:justify-self-center' },
  { key: 'employees', placement: 'lg:justify-self-end lg:mr-8' },
] as const;

type PortalStatsProps = Readonly<{
  stats: PortalStatsData;
}>;

export function PortalStats({ stats }: PortalStatsProps) {
  const t = useTranslations('PortalStats');
  const format = useFormatter();

  return (
    <Card asChild className="bg-surface-soft px-6 py-6 lg:bg-surface-card lg:px-8 lg:py-8">
      <section aria-label={t('label')}>
        <dl className="grid justify-items-center gap-8 lg:grid-cols-3 lg:gap-0">
          {STATS.map(({ key, placement }) => (
            <div key={key} className={`flex flex-col-reverse items-center gap-1 lg:items-start ${placement}`}>
              <dt className="text-body-l text-text-body">{t(key)}</dt>
              <dd className="text-number-l text-text-heading lg:text-number-2xl">
                {format.number(
                  stats[key],
                  stats[key] >= COMPACT_FROM ? { notation: 'compact', maximumFractionDigits: 1 } : {},
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Card>
  );
}
