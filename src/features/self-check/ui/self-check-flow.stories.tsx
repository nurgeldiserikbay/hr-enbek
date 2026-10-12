import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { getSelfCheckTopic, type SelfCheckTopic } from '@/entities/self-checks';

import { SelfCheckFlow } from './self-check-flow.tsx';

const SUPPORT = <div className="rounded-2xl bg-brand-primary p-5 text-text-inverse">1414</div>;

const meta = {
  title: 'features/self-check/SelfCheckFlow',
  component: SelfCheckFlow,
  args: { topic: undefined as unknown as SelfCheckTopic, support: SUPPORT },
  loaders: [async () => ({ topic: await getSelfCheckTopic('termination') })],
  render: (args, { loaded }) => <SelfCheckFlow {...args} topic={loaded['topic'] as SelfCheckTopic} />,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="page-container bg-surface-page py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelfCheckFlow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Question: Story = {};

export const HighRiskResult: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const label of ['Нет', 'Нет', 'Да']) {
      await userEvent.click(canvas.getByRole('radio', { name: label }));
      await userEvent.click(canvas.getByRole('button', { name: /Далее|Результат/u }));
    }
    await expect(canvas.getByRole('heading', { name: 'Найдены вероятные нарушения' })).toBeVisible();
  },
};

export const LowRiskResult: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (let index = 0; index < 3; index += 1) {
      await userEvent.click(canvas.getByRole('radio', { name: 'Да' }));
      await userEvent.click(canvas.getByRole('button', { name: /Далее|Результат/u }));
    }
    await expect(canvas.getByRole('heading', { name: 'Нарушений не найдено' })).toBeVisible();
  },
};
