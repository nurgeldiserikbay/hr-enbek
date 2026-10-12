import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ProgressBar } from './progress-bar.tsx';

const meta = {
  title: 'shared/ui/ProgressBar',
  component: ProgressBar,
  args: { value: 3, max: 8, label: 'Пройдено вопросов', className: 'w-64' },
} satisfies Meta<typeof ProgressBar>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
