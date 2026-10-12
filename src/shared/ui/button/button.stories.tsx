import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button.tsx';

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  args: { children: 'Пройти самопроверку' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const Disabled: Story = { args: { disabled: true } };
