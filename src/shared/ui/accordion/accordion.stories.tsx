import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AccordionItem } from './accordion.tsx';

const meta = {
  title: 'shared/ui/AccordionItem',
  component: AccordionItem,
  args: {
    title: 'Нужно ли регистрировать трудовой договор в ЕСУТД?',
    children: (
      <p className="text-body-m text-text-body">
        Да. Работодатель вносит сведения о каждом трудовом договоре в ЕСУТД через личный кабинет HR Enbek.
      </p>
    ),
    className: 'w-180',
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-page p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccordionItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = { args: { defaultOpen: true } };
