import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PortalStats } from './portal-stats.tsx';

const meta = {
  title: 'widgets/PortalStats',
  component: PortalStats,
  args: {
    stats: {
      indicators: [
        { code: 'contracts', title: 'Договоров', value: 6_900_000, unit: 'count', lang: 'ru' },
        { code: 'employers', title: 'Работодателей', value: 619_621, unit: 'count', lang: 'ru' },
        { code: 'employees', title: 'Работников', value: 5_900_000, unit: 'count', lang: 'ru' },
      ],
      calculatedAt: '2026-10-19T07:05:00Z',
      isStale: false,
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PortalStats>;

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const StaleData: StoryObj<typeof meta> = { args: { stats: { ...meta.args.stats, isStale: true } } };
