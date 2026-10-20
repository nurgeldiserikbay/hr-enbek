import { useFormatter, useTranslations } from 'next-intl';

import type { PortalStats as PortalStatsData } from '@/entities/portal-stats';
import { Card } from '@/shared/ui/card';

const COMPACT_FROM = 1_000_000;

const PLACEMENTS = ['lg:w-52 lg:justify-self-start', 'lg:justify-self-center', 'lg:justify-self-end lg:mr-8'];

type Indicator = PortalStatsData['indicators'][number];

type PortalStatsProps = Readonly<{
  stats: PortalStatsData;
}>;

export function PortalStats({ stats }: PortalStatsProps) {
  const t = useTranslations('PortalStats');
  const format = useFormatter();

  const formatValue = ({ value, unit }: Indicator) => {
    switch (unit) {
      case 'percent': {
        return format.number(value, { style: 'unit', unit: 'percent', maximumFractionDigits: 1 });
      }
      case 'tenge': {
        return format.number(value, {
          style: 'currency',
          currency: 'KZT',
          notation: 'compact',
          maximumFractionDigits: 1,
        });
      }
      case 'count': {
        return format.number(value, value >= COMPACT_FROM ? { notation: 'compact', maximumFractionDigits: 1 } : {});
      }
    }
  };

  if (stats.indicators.length === 0) return null;

  return (
    <Card asChild className="bg-surface-soft px-6 py-6 lg:bg-surface-card lg:px-8 lg:py-8">
      <section aria-label={t('label')}>
        <dl className="grid justify-items-center gap-8 lg:grid-cols-3 lg:gap-0">
          {stats.indicators.map((indicator, index) => (
            <div
              key={indicator.code}
              className={`flex flex-col-reverse items-center justify-end gap-1 lg:items-start ${PLACEMENTS[index % PLACEMENTS.length] ?? ''}`}
            >
              <dt lang={indicator.lang} className="text-body-l text-text-body">
                {indicator.title}
              </dt>
              <dd className="text-number-l text-text-heading lg:text-number-2xl">{formatValue(indicator)}</dd>
            </div>
          ))}
        </dl>
        {stats.calculatedAt !== undefined && (
          <p className="mt-6 text-center text-caption text-text-body lg:text-left">
            {t(stats.isStale ? 'staleAt' : 'updatedAt', {
              date: format.dateTime(new Date(stats.calculatedAt), { dateStyle: 'long', timeStyle: 'short' }),
            })}
          </p>
        )}
      </section>
    </Card>
  );
}
