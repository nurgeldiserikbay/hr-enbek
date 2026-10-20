import type { Locale } from '@/shared/config';
import type { RichTextDocument } from '@/shared/lib/rich-text';

export interface FaqLink {
  label: string;
  href: string;
  lang: Locale;
}

export interface FaqQuestion {
  id: string;
  question: string;
  answer: RichTextDocument;
  lang: Locale;
  answerLang: Locale;
  link: FaqLink | undefined;
}

export interface FaqTopic {
  id: string;
  title: string;
  lang: Locale;
}

export interface FaqCategory extends FaqTopic {
  questions: readonly FaqQuestion[];
}
