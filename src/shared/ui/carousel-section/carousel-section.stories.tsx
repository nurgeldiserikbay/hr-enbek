import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FilePen } from '@/shared/ui/icon';

import { FeatureCard } from '../feature-card/feature-card.tsx';
import { CarouselSection } from './carousel-section.tsx';

const meta = {
  title: 'shared/ui/CarouselSection',
  component: CarouselSection,
  args: {
    title: 'Возможности портала для предприятий',
    description: 'Всё, что нужно для работы с трудовыми отношениями, — в одном кабинете',
    previousLabel: 'Назад',
    nextLabel: 'Вперёд',
    itemClassName: 'w-70 lg:w-97',
    items: ['Регистрация', 'Корректировка', 'Удалённое заключение', 'Штатное расписание', 'Спецвыплаты'].map(
      (title) => ({
        key: title,
        node: <FeatureCard className="w-full" icon={<FilePen />} title={title} description="Описание возможности" />,
      }),
    ),
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="bg-surface-page py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CarouselSection>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
