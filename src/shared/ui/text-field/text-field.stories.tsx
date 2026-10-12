import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EyeOff } from '@/shared/ui/icon';

import { TextField } from './text-field.tsx';

const meta = {
  title: 'shared/ui/TextField',
  component: TextField,
  args: { label: 'ИИН или логин', placeholder: 'Введите ИИН или логин' },
  decorators: [
    (Story) => (
      <div className="w-118">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = { args: { defaultValue: '900101300123' } };

export const WithTrailing: Story = {
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
    trailing: <EyeOff aria-hidden="true" className="size-5 text-text-body" />,
  },
};
