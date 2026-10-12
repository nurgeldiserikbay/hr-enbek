import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '../button/button.tsx';
import { SectionHeader } from './section-header.tsx';

const meta = {
  title: 'shared/ui/SectionHeader',
  component: SectionHeader,
  args: {
    title: 'Новости',
    accent: 'портала',
    description: 'Изменения в законодательстве, новые сервисы и обновления HR Enbek',
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: { actions: <Button className="h-10 text-body-l font-normal">Все новости</Button> },
};
