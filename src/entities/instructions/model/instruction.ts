import type { ContentLanguage } from '@/shared/api';
import type { ContentAudience } from '@/shared/config';

export interface Instruction {
  id: string;
  title: string;
  description: string | undefined;
  audience: ContentAudience;
  icon: string | undefined;
  pdfUrl: string;
  openUrl: string;
  language: ContentLanguage;
}
