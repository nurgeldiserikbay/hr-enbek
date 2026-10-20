import { z } from 'zod';

import { cmsContentLanguageShape, requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { IndicatorUnit, PortalStats } from '../model/portal-stats.ts';

const UNITS = { COUNT: 'count', PERCENT: 'percent', TENGE: 'tenge' } as const satisfies Record<string, IndicatorUnit>;

const indicatorSchema = z.object({
  code: z.string().min(1),
  title: z.string(),
  value: z.number(),
  unit: z
    .enum(['COUNT', 'PERCENT', 'TENGE'])
    .nullish()
    .transform((unit) => UNITS[unit ?? 'COUNT']),
  calculatedAt: z.iso.datetime({ offset: true }),
  isStale: z.boolean(),
  sortOrder: z.number().int(),
  langUsed: cmsContentLanguageShape.langUsed,
});

export const portalStatsSchema = z.array(indicatorSchema).transform((indicators): PortalStats => {
  const ordered = indicators.toSorted((left, right) => left.sortOrder - right.sortOrder);
  const calculatedAt = ordered
    .map((indicator) => indicator.calculatedAt)
    .toSorted((left, right) => Date.parse(left) - Date.parse(right))[0];
  return {
    indicators: ordered.map(({ code, title, value, unit, langUsed }) => ({ code, title, value, unit, lang: langUsed })),
    calculatedAt,
    isStale: ordered.some((indicator) => indicator.isStale),
  };
});

export async function getPortalStats(locale: Locale): Promise<PortalStats> {
  return portalStatsSchema.parse(
    await requestCms({ path: '/api/v1/public/indicators', locale, sections: ['indicators'] }),
  );
}
