import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Chip } from './chip.tsx';

const meta = {
  title: 'shared/ui/Chip',
  component: Chip,
  args: { children: 'Работодателю' },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { args: { isActive: true } };

export const AsLinks: Story = {
  render: () => (
    <nav aria-label="Для кого" className="flex gap-2">
      {['Все', 'Работодателю', 'Работнику'].map((label, index) => (
        <Chip key={label} asChild isActive={index === 0}>
          <a href="#chips">{label}</a>
        </Chip>
      ))}
    </nav>
  ),
};
