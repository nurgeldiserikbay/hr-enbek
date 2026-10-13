import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextArea } from './text-area.tsx';

const meta = {
  title: 'shared/ui/TextArea',
  component: TextArea,
  args: { label: 'Описание', placeholder: 'Опишите ваш вопрос' },
  decorators: [
    (Story) => (
      <div className="w-167">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { defaultValue: 'Работодатель не выплатил заработную плату за последние два месяца.' },
};
