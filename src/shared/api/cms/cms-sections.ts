export const CMS_SECTIONS = [
  'news',
  'faq',
  'legal-acts',
  'instructions',
  'video-instructions',
  'services',
  'agreements',
  'regions',
  'content-blocks',
  'labor-inspections',
  'indicators',
  'feedback',
] as const;

export type CmsSection = (typeof CMS_SECTIONS)[number];

export const cmsSectionTag = (section: CmsSection) => `cms:${section}`;
