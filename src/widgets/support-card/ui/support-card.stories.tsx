import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SupportCard } from './support-card.tsx';

const meta = {
  title: 'widgets/SupportCard',
  component: SupportCard,
  args: { className: 'w-102' },
} satisfies Meta<typeof SupportCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Full: Story = {};

export const Compact: Story = { args: { variant: 'compact', className: 'w-90' } };
