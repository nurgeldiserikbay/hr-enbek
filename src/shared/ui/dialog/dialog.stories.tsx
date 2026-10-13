import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Dialog } from './dialog.tsx';

const meta = {
  title: 'shared/ui/Dialog',
  component: Dialog,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    'aria-label': 'Пример',
    children: <p className="p-6 text-body-m">Содержимое диалога</p>,
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Drawer: Story = {};

export const Fullscreen: Story = { args: { layout: 'fullscreen' } };
