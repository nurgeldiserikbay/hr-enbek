export const HELP_SECTIONS = ['faq', 'normative', 'instructions', 'videos', 'services', 'agreements'] as const;

export type HelpSection = (typeof HELP_SECTIONS)[number];

export const parseHelpSection = (value: string): HelpSection | undefined =>
  HELP_SECTIONS.find((section) => section === value);

export const helpSectionRoute = (section: HelpSection) => `/help/${section}`;
