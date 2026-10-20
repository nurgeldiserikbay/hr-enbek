import type { ContentLanguage } from '@/shared/api';
import type { Locale } from '@/shared/config';

export interface AgreementFiles {
  kk: string | undefined;
  ru: string | undefined;
}

export interface Agreement {
  id: string;
  title: string;
  titleLang: Locale;
  description: string | undefined;
  files: AgreementFiles;
  language: ContentLanguage;
}

export interface Agreements {
  general: readonly Agreement[];
  regional: readonly Agreement[];
}
