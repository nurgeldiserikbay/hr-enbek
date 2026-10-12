import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StepList } from './step-list.tsx';

const meta = {
  title: 'shared/ui/StepList',
  component: StepList,
  args: {
    className: 'flex w-80 flex-col gap-1',
    steps: [
      { key: 'contracts', label: 'Письменные трудовые договоры', state: 'done' },
      { key: 'ectd', label: 'Сведения в ЕСУТД в срок', state: 'done' },
      { key: 'terms', label: 'Обязательные условия договора', state: 'current' },
      { key: 'rules', label: 'Ознакомление с правилами', state: 'upcoming' },
    ],
  },
} satisfies Meta<typeof StepList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Questions: Story = {};

export const OnBrand: Story = {
  args: {
    tone: 'inverse',
    className: 'flex w-80 flex-col gap-2.5',
    steps: [
      { key: 'topic', label: 'Выберите тему', state: 'done' },
      { key: 'answer', label: 'Ответьте на вопросы', state: 'current' },
      { key: 'result', label: 'Получите результат', state: 'upcoming' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-brand-primary p-6">
        <Story />
      </div>
    ),
  ],
};
