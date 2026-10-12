import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PortalStats } from './portal-stats.tsx';

const meta = {
  title: 'widgets/PortalStats',
  component: PortalStats,
  args: { stats: { contracts: 6_900_000, employers: 619_621, employees: 5_900_000 } },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PortalStats>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
