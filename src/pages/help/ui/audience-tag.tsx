import { useTranslations } from 'next-intl';

import type { Audience } from '@/shared/config';
import { Tag } from '@/shared/ui/tag';

type AudienceTagProps = Readonly<{
  audience: Audience;
}>;

export function AudienceTag({ audience }: AudienceTagProps) {
  const t = useTranslations('HelpPage.audience');

  return (
    <Tag size="sm" tone={audience === 'employee' ? 'success' : 'neutral'}>
      {t(audience)}
    </Tag>
  );
}
