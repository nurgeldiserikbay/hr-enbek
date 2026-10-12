import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TriangleAlert } from '@/shared/ui/icon';

import { Tag } from './tag.tsx';

const meta = {
  title: 'shared/ui/Tag',
  component: Tag,
  args: { children: 'Новости' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag size="sm">Работодателю</Tag>
      <Tag size="sm" tone="success">
        Работнику
      </Tag>
      <Tag size="sm" tone="warning">
        Средний риск
      </Tag>
      <Tag size="sm" tone="danger">
        <TriangleAlert aria-hidden="true" />
        Высокий риск
      </Tag>
    </div>
  ),
};
