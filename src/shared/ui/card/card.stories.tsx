import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Card } from './card.tsx';

const meta = {
  title: 'shared/ui/Card',
  component: Card,
  args: {
    className: 'w-80 p-6 text-body-m text-text-body',
    children: 'Карточка — общая подложка для Quick Action, Feature, News и Stat. Содержимое собирается на месте.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['card', 'soft'] },
    radius: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-page p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Soft: Story = { args: { tone: 'soft' } };

export const SmallRadius: Story = { args: { radius: 'md' } };
