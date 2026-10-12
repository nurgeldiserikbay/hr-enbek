import { useTranslations } from 'next-intl';

import { type Audience, AUDIENCES } from '@/shared/config';

import { type HelpSection, helpSectionRoute } from '../config/sections.ts';
import { FilterChips } from './filter-chips.tsx';

type AudienceFilterProps = Readonly<{
  section: HelpSection;
  audience: Audience | undefined;
  query: string | undefined;
}>;

export function AudienceFilter({ section, audience, query }: AudienceFilterProps) {
  const t = useTranslations('HelpPage');

  return (
    <FilterChips
      label={t('audienceFilter')}
      pathname={helpSectionRoute(section)}
      param="audience"
      current={audience}
      query={query}
      options={[
        { value: undefined, label: t('all') },
        ...AUDIENCES.map((value) => ({ value, label: t(`audience.${value}`) })),
      ]}
    />
  );
}
