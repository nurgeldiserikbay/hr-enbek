import { useTranslations } from 'next-intl';

import type { ContentAudience } from '@/shared/config';
import { Tag } from '@/shared/ui/tag';

type AudienceTagProps = Readonly<{
  audience: ContentAudience;
}>;

export function AudienceTag({ audience }: AudienceTagProps) {
  const t = useTranslations('HelpPage.audience');

  if (audience === 'all') return null;

  return (
    <Tag size="sm" tone={audience === 'employee' ? 'success' : 'neutral'}>
      {t(audience)}
    </Tag>
  );
}
