import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CircleX, Download, MapPin, Scale } from '@/shared/ui/icon';

import { Button } from '../button/button.tsx';
import { ItemRow } from './item-row.tsx';

const meta = {
  title: 'shared/ui/ItemRow',
  component: ItemRow,
  args: {
    icon: <Scale />,
    title: 'Трудовой кодекс Республики Казахстан',
    description: 'Основной закон, регулирующий трудовые отношения',
    className: 'w-200',
    actions: (
      <Button variant="secondary" size="sm" className="h-9 font-normal">
        <Download aria-hidden="true" className="size-4" />
        PDF
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-page p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ItemRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Document: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
    icon: <MapPin />,
    title: 'г. Астана',
    description: 'Региональное соглашение',
    className: 'w-120',
  },
};

export const Issue: Story = {
  args: {
    iconTone: 'danger',
    icon: <CircleX />,
    title: 'Сведения о договорах не внесены в ЕСУТД в срок',
    description: 'Зарегистрируйте договоры на портале.',
    actions: undefined,
  },
};
