import type { Locale } from '@/shared/config';

export type IndicatorUnit = 'count' | 'percent' | 'tenge';

interface Indicator {
  code: string;
  title: string;
  value: number;
  unit: IndicatorUnit;
  lang: Locale;
}

export interface PortalStats {
  indicators: readonly Indicator[];
  calculatedAt: string | undefined;
  isStale: boolean;
}
