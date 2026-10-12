import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { getLabourInspections } from '@/entities/labour-inspections';

import { LabourInspection } from './labour-inspection.tsx';

const meta = {
  title: 'widgets/LabourInspection',
  component: LabourInspection,
  args: { inspections: [] },
  loaders: [async () => ({ inspections: await getLabourInspections() })],
  render: (args, { loaded }) => <LabourInspection {...args} {...loaded} />,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LabourInspection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

const chooseRegion = async (canvasElement: HTMLElement, name: string) => {
  await userEvent.click(within(canvasElement).getByRole('combobox'));
  await userEvent.click(within(document.body).getByRole('option', { name }));
};

export const RegionWithFullData: Story = {
  play: async ({ canvasElement }) => {
    await chooseRegion(canvasElement, 'Актюбинская область');
    await expect(within(canvasElement).getByText('Директор:')).toBeVisible();
  },
};

export const RegionWithPartialData: Story = {
  play: async ({ canvasElement }) => {
    await chooseRegion(canvasElement, 'Акмолинская область');
    await expect(within(canvasElement).queryByText('Директор:')).toBeNull();
  },
};
