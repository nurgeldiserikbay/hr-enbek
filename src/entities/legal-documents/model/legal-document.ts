import type { ContentLanguage } from '@/shared/api';
import type { Locale } from '@/shared/config';

export interface LegalDocument {
  id: string;
  title: string;
  description: string | undefined;
  openUrl: string | undefined;
  pdfUrl: string | undefined;
  language: ContentLanguage;
}

export interface LegalDocumentGroup {
  id: string;
  title: string;
  icon: string | undefined;
  lang: Locale;
  documents: readonly LegalDocument[];
}
