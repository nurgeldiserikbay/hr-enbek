import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BookOpen, CircleHelp, CircleX, Phone } from '@/shared/ui/icon';

import { IconTile } from './icon-tile.tsx';

const meta = {
  title: 'shared/ui/IconTile',
  component: IconTile,
  args: { children: <BookOpen /> },
  argTypes: {
    tone: { control: 'inline-radio', options: ['brand', 'danger', 'warning', 'inverse'] },
    size: { control: 'inline-radio', options: ['responsive', 'md', 'sm'] },
  },
} satisfies Meta<typeof IconTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-2xl bg-brand-primary p-4">
      <IconTile size="md">
        <BookOpen />
      </IconTile>
      <IconTile size="md" tone="danger">
        <CircleX />
      </IconTile>
      <IconTile size="md" tone="warning">
        <CircleHelp />
      </IconTile>
      <IconTile size="md" tone="inverse">
        <Phone />
      </IconTile>
    </div>
  ),
};
