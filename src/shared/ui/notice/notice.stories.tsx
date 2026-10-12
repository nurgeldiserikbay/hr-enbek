import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Info, Scale } from '@/shared/ui/icon';

import { Notice } from './notice.tsx';

const meta = {
  title: 'shared/ui/Notice',
  component: Notice,
  args: {
    icon: <Scale aria-hidden="true" />,
    title: 'Почему это важно',
    children: 'Условия трудового договора определяет Трудовой кодекс РК.',
    className: 'w-160',
  },
} satisfies Meta<typeof Notice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Warning: Story = {
  args: {
    tone: 'warning',
    icon: <Info aria-hidden="true" />,
    children: 'С 12 марта 2026 года за нарушение сроков внесения сведений в ЕСУТД предусмотрена ответственность.',
  },
};
