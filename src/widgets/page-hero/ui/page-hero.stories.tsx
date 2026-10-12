import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BookOpen, ClipboardCheck, FilePen, Smartphone } from '@/shared/ui/icon';

import { PageHero } from './page-hero.tsx';

const MOCK_PHOTO = { src: '/mock/videos/thumbnail.jpg', width: 486, height: 240 };

const meta = {
  title: 'widgets/PageHero',
  component: PageHero,
  args: {
    title: 'Организовывайте процесс',
    accent: 'трудоустройства онлайн',
    description: 'Портал трудовых ресурсов упрощает процессы кадрового делопроизводства.',
    primaryAction: { label: 'Пройти самопроверку', href: '/self-check' },
    secondaryAction: { label: 'Войти / Зарегистрироваться', href: '/login' },
    photo: { desktop: MOCK_PHOTO, mobile: MOCK_PHOTO },
    photoCard: {
      icon: <ClipboardCheck />,
      title: 'Пройдите самопроверку (без входа)',
      description: 'Узнайте, на что обратить внимание в трудовых отношениях.',
      href: '/self-check',
    },
    quickActionsLabel: 'Быстрые действия',
    quickActions: [
      {
        icon: <FilePen />,
        title: 'Авторизуйся и регистрируй договоры',
        description: 'Быстро и онлайн',
        href: '/login',
      },
      { icon: <BookOpen />, title: 'Ответы на все вопросы', description: 'Нужные сведения', href: '/help' },
      { icon: <Smartphone />, title: 'Скачать HR Enbek', description: 'Работайте с телефона', href: '/mobile-app' },
    ],
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="page-container bg-surface-page py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThreeQuickActions: Story = {};

export const TwoQuickActions: Story = {
  args: {
    quickActions: [
      {
        icon: <FilePen />,
        title: 'Единый профиль сотрудников',
        description: 'Данные в одной карточке',
        href: '/login',
      },
      { icon: <BookOpen />, title: 'Единая база личных дел', description: 'Справки работника', href: '/staffing' },
    ],
  },
};
