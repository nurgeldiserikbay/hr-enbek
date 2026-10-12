import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QrCode, Smartphone, UserCheck } from '@/shared/ui/icon';

import { Showcase } from './showcase.tsx';

const meta = {
  title: 'widgets/Showcase',
  component: Showcase,
  args: {
    title: 'Договор без визита в офис',
    description: 'Работодатель и работник подписывают электронный трудовой договор удалённо.',
    items: [
      { icon: <QrCode />, text: 'Работодатель подписывает ЭЦП или QR через eGov Mobile Business' },
      { icon: <UserCheck />, text: 'Работник подтверждает договор в eGov Mobile' },
      { icon: <Smartphone />, text: 'Работник видит его в приложении Enbek HR' },
    ],
    action: { label: 'Инструкция', href: '/help/instructions' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="bg-surface-page p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Showcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithoutVisual: Story = {};

export const WithVisual: Story = {
  args: { visual: <div className="size-full min-h-80 bg-brand-primary" /> },
};
