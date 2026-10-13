import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { FeedbackDialog } from './feedback-dialog.tsx';

const meta = {
  title: 'features/FeedbackDialog',
  component: FeedbackDialog,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    regions: [
      { value: 'akmola', label: 'Акмолинская область' },
      { value: 'aktobe', label: 'Актюбинская область' },
      { value: 'almaty', label: 'г. Алматы' },
    ],
  },
} satisfies Meta<typeof FeedbackDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: { viewport: { value: 'mobile2' } } };
