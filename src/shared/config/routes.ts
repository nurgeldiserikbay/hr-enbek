export const ROUTES = {
  home: '/',
  about: '/about',
  employer: '/employer',
  employee: '/employee',
  news: '/news',
  selfCheck: '/self-check',
  login: '/login',
  staffLogin: '/auth',
  feedback: '/feedback',
  contracts: '/contracts',
  staffing: '/staffing',
  consultant: '/consultant',
  mobileApp: '/mobile-app',
  help: '/help',
  helpNormative: '/help/normative',
  helpInstructions: '/help/instructions',
  helpVideos: '/help/videos',
  helpServices: '/help/services',
  helpAgreements: '/help/agreements',
  helpFaq: '/help/faq',
} as const;

export const newsArticleRoute = (id: string) => `${ROUTES.news}/${id}`;

export const selfCheckTopicRoute = (id: string) => `${ROUTES.selfCheck}/${id}`;

export const EXTERNAL_LINKS = {
  constitution: 'https://adilet.zan.kz/rus/docs/K950001000_',
  labourExchange: 'https://www.enbek.kz',
  skills: 'https://skills.enbek.kz',
  business: 'https://business.enbek.kz',
  career: 'https://career.enbek.kz',
  migration: 'https://migration.enbek.kz',
  mansap: 'https://mansap.enbek.kz',
  facebook: 'https://www.facebook.com/enbek.kz',
  instagram: 'https://www.instagram.com/enbek.kz',
  hotline: 'tel:1414',
} as const;

export const ECOSYSTEM_LINK_KEYS = ['labourExchange', 'skills', 'business', 'career', 'migration', 'mansap'] as const;
