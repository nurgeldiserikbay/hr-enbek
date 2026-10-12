export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignBlock {
  name: string;
  selector: string;
  design?: { desktop: Rect; mobile: Rect };
}

export interface DesignPage {
  name: string;
  path: string;
  designs: { desktop: string; mobile: string };
  blocks?: DesignBlock[];
  answers?: readonly string[];
  select?: string;
}

export const DESIGN_PAGES: DesignPage[] = [
  {
    name: 'Главная',
    path: '/ru',
    designs: { desktop: 'main.png', mobile: 'Main · Mobile.png' },
    blocks: [
      {
        name: 'Шапка',
        selector: 'header',
        design: { desktop: { x: 0, y: 0, width: 1440, height: 85 }, mobile: { x: 0, y: 0, width: 390, height: 64 } },
      },
      {
        name: 'Первый экран',
        selector: 'main section:has(h1)',
        design: {
          desktop: { x: 60, y: 140, width: 1320, height: 560 },
          mobile: { x: 16, y: 88, width: 358, height: 1204 },
        },
      },
      {
        name: 'Статистика',
        selector: 'main section:has(dl)',
        design: {
          desktop: { x: 60, y: 756, width: 1320, height: 150 },
          mobile: { x: 16, y: 1324, width: 358, height: 304 },
        },
      },
      {
        name: 'Работодателю и работнику',
        selector: 'main section[aria-labelledby^="audience-"]',
        design: {
          desktop: { x: 60, y: 978, width: 1320, height: 457 },
          mobile: { x: 16, y: 1668, width: 358, height: 1000 },
        },
      },
      {
        name: 'Новости',
        selector: 'main section:has(a[href*="/news/"])',
        design: {
          desktop: { x: 0, y: 1481, width: 1440, height: 425 },
          mobile: { x: 0, y: 2705, width: 390, height: 941 },
        },
      },
      {
        name: 'Инспекция труда',
        selector: 'main section:has([role=combobox])',
        design: {
          desktop: { x: 60, y: 1951, width: 1320, height: 104 },
          mobile: { x: 16, y: 3686, width: 358, height: 144 },
        },
      },
      {
        name: 'Подвал',
        selector: 'footer',
        design: {
          desktop: { x: 0, y: 2091, width: 1440, height: 720 },
          mobile: { x: 0, y: 3870, width: 390, height: 1525 },
        },
      },
    ],
  },
  { name: 'О проекте', path: '/ru/about', designs: { desktop: 'О проекте.png', mobile: 'О проекте · Mobile.png' } },
  {
    name: 'Работодателю',
    path: '/ru/employer',
    designs: { desktop: 'employer.png', mobile: 'Работодателю · Mobile.png' },
  },
  { name: 'Работнику', path: '/ru/employee', designs: { desktop: 'employee.png', mobile: 'Работнику · Mobile.png' } },
  {
    name: 'Вопросы и ответы',
    path: '/ru/help/faq',
    designs: { desktop: 'faq.png', mobile: 'Вопросы и ответы · Mobile.png' },
  },
  {
    name: 'Нормативные акты',
    path: '/ru/help/normative',
    designs: { desktop: 'normative.png', mobile: 'Справочная · Нормативные акты · Mobile.png' },
  },
  {
    name: 'Инструкции',
    path: '/ru/help/instructions',
    designs: { desktop: 'instructions.png', mobile: 'Справочная · Инструкции · Mobile.png' },
  },
  {
    name: 'Видеоинструкции',
    path: '/ru/help/videos',
    designs: { desktop: 'Справочная · Видеоинструкции.png', mobile: 'Справочная · Видеоинструкции · Mobile.png' },
  },
  {
    name: 'Сервисы',
    path: '/ru/help/services',
    designs: { desktop: 'Справочная · Сервисы.png', mobile: 'Справочная · Сервисы · Mobile.png' },
  },
  {
    name: 'Соглашения',
    path: '/ru/help/agreements',
    designs: { desktop: 'Справочная · Соглашения.png', mobile: 'Справочная · Соглашения · Mobile.png' },
  },
  { name: 'Новости', path: '/ru/news', designs: { desktop: 'Новости.png', mobile: 'Новости · Mobile.png' } },
  {
    name: 'Новость',
    path: '/ru/news/ectd-deadline-liability',
    designs: { desktop: 'Новость · статья.png', mobile: 'Новость · статья · Mobile.png' },
  },
  {
    name: 'Самопроверка: темы',
    path: '/ru/self-check',
    designs: { desktop: 'Самопроверка · 1 Выбор темы.png', mobile: 'Самопроверка · 1 Выбор темы · Mobile.png' },
  },
  {
    name: 'Самопроверка: вопрос',
    path: '/ru/self-check/hiring',
    answers: ['Да', 'Да'],
    select: 'Нет',
    designs: { desktop: 'Самопроверка · 2 Вопрос.png', mobile: 'Самопроверка · 2 Вопрос · Mobile.png' },
  },
  {
    name: 'Самопроверка: высокий риск',
    path: '/ru/self-check/hiring',
    answers: ['Нет', 'Нет', 'Нет', 'Нет', 'Да', 'Нет', 'Не знаю', 'Да'],
    designs: {
      desktop: 'Самопроверка · 3 Результат · Высокий риск.png',
      mobile: 'Самопроверка · 3 Результат · Высокий риск · Mobile.png',
    },
  },
  {
    name: 'Самопроверка: низкий риск',
    path: '/ru/self-check/hiring',
    answers: ['Да', 'Да', 'Да', 'Да', 'Да', 'Да', 'Да', 'Да'],
    designs: {
      desktop: 'Самопроверка · 3 Результат · Низкий риск.png',
      mobile: 'Самопроверка · 3 Результат · Низкий риск · Mobile.png',
    },
  },
];
