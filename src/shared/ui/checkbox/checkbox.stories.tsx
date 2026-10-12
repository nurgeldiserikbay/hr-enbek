import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox.tsx';

const meta = {
  title: 'shared/ui/Checkbox',
  component: Checkbox,
  args: { 'aria-label': 'Я принимаю пользовательское соглашение' },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };
