import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Breadcrumbs } from './breadcrumbs.tsx';

const meta = {
  title: 'shared/ui/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    label: 'Хлебные крошки',
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Новости', href: '/news' },
      { label: 'Введена ответственность за нарушение сроков внесения сведений в ЕСУТД' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
