import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SiteHeader } from './site-header.tsx';

const meta = {
  title: 'widgets/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: { viewport: { value: 'mobile2' } } };
