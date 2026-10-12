import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SiteFooter } from './site-footer.tsx';

const meta = {
  title: 'widgets/SiteFooter',
  component: SiteFooter,
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta<typeof SiteFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = { globals: { viewport: { value: 'mobile2' } } };
