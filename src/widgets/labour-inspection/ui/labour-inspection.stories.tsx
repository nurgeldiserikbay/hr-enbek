import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { LabourInspection } from './labour-inspection.tsx';

const meta = {
  title: 'widgets/LabourInspection',
  component: LabourInspection,
  args: {
    inspections: [
      {
        regionId: '150000000',
        regionName: 'Актюбинская область',
        regionLang: 'ru',
        department: {
          organization: 'Департамент по Актюбинской области',
          address: 'г. Актобе, пр. Абилкайыр хана, 40',
          phone: '+7 (7132) 55-21-34',
          email: 'aktobe@enbek.gov.kz',
          inspectors: ['Ахметов Ерлан Серикович', 'Иванова Мария Петровна'],
          director: 'Жумабаев Нурлан Каиратович',
          lang: 'ru',
        },
      },
      {
        regionId: '110000000',
        regionName: 'Акмолинская область',
        regionLang: 'ru',
        department: {
          organization: 'Департамент по Акмолинской области',
          address: 'г. Кокшетау, ул. Абая, 96',
          phone: undefined,
          email: undefined,
          inspectors: ['Сейтказиев Арман Болатович'],
          director: undefined,
          lang: 'ru',
        },
      },
      { regionId: '620000000', regionName: 'область Ұлытау', regionLang: 'ru', department: undefined },
    ],
  },
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
    await expect(within(canvasElement).getByRole('link', { name: 'aktobe@enbek.gov.kz' })).toBeVisible();
  },
};

export const RegionWithPartialData: Story = {
  play: async ({ canvasElement }) => {
    await chooseRegion(canvasElement, 'Акмолинская область');
    await expect(within(canvasElement).queryByText('Директор:')).toBeNull();
  },
};

export const RegionWithoutData: Story = {
  play: async ({ canvasElement }) => {
    await chooseRegion(canvasElement, 'область Ұлытау');
    await expect(within(canvasElement).getByText('Сведения по этому региону пока не внесены')).toBeVisible();
  },
};
