import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NewsCard } from './news-card.tsx';

const RUSSIAN = { lang: 'ru', fallbackFields: [] } as const;

const meta = {
  title: 'entities/news/NewsCard',
  component: NewsCard,
  args: {
    className: 'w-[21.8125rem]',
    news: {
      slug: 'business-visa',
      title: 'Что нужно сделать чтобы получить бизнес-визу?',
      excerpt: 'Все гораздо просто чем кажется, но здесь нужна сноровка и терпение',
      publishedAt: '2023-09-12T04:00:00Z',
      readingMinutes: 5,
      category: { id: 'services', title: 'Сервисы', lang: 'ru' },
      isPinned: false,
      cover: undefined,
      language: RUSSIAN,
    },
  },
} satisfies Meta<typeof NewsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    news: {
      ...meta.args.news,
      slug: 'ectd-deadline-liability',
      title: 'Введена ответственность за нарушение сроков внесения сведений в ЕСУТД',
      excerpt: 'С 12 марта 2026 года — административная ответственность по ст. 98 КоАП РК.',
      publishedAt: '2026-03-12T04:00:00Z',
      readingMinutes: 3,
      category: { id: 'legislation', title: 'Законодательство', lang: 'ru' },
    },
  },
};

export const WithoutCategoryAndSummary: Story = {
  args: {
    news: {
      ...meta.args.news,
      slug: 'self-check-new-topics',
      title: 'Самопроверка: новые темы по оплате и рабочему времени',
      excerpt: undefined,
      category: undefined,
    },
  },
};

export const KazakhFallbackSummary: Story = {
  args: {
    news: {
      ...meta.args.news,
      title: 'New services for employers',
      excerpt: 'Жұмыс берушілерге арналған жаңа қызметтер',
      language: { lang: 'en', fallbackFields: ['summary'] },
    },
  },
};
