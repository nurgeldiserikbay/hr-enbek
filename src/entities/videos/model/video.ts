import type { ContentLanguage } from '@/shared/api';
import type { ContentAudience } from '@/shared/config';

export interface Video {
  id: string;
  title: string;
  audience: ContentAudience;
  durationSeconds: number | undefined;
  thumbnailUrl: string | undefined;
  url: string;
  language: ContentLanguage;
}
