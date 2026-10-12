import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NewsCard } from './news-card.tsx';

const meta = {
  title: 'entities/news/NewsCard',
  component: NewsCard,
  args: {
    className: 'w-[21.8125rem]',
    news: {
      id: 'business-visa',
      title: 'Что нужно сделать чтобы получить бизнес-визу?',
      excerpt: 'Все гораздо просто чем кажется, но здесь нужна сноровка и терпение',
      publishedAt: '2023-09-12',
      readingMinutes: 5,
      category: { id: 'services', title: 'Сервисы' },
    },
  },
} satisfies Meta<typeof NewsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    news: {
      id: 'ectd-deadline-liability',
      title: 'Введена ответственность за нарушение сроков внесения сведений в ЕСУТД',
      excerpt: 'С 12 марта 2026 года — административная ответственность по ст. 98 КоАП РК.',
      publishedAt: '2026-03-12',
      readingMinutes: 3,
      category: { id: 'legislation', title: 'Законодательство' },
    },
  },
};

export const WithoutCategory: Story = {
  args: {
    news: {
      id: 'self-check-new-topics',
      title: 'Самопроверка: новые темы по оплате и рабочему времени',
      excerpt: 'Проверьте компанию по 6 темам и получите рекомендации без входа.',
      publishedAt: '2025-11-06',
      readingMinutes: 2,
    },
  },
};
