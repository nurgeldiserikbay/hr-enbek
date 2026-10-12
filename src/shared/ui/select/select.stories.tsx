import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Select } from './select.tsx';

const meta = {
  title: 'shared/ui/Select',
  component: Select,
  args: {
    placeholder: 'Выберите область',
    'aria-labelledby': 'select-label',
    className: 'w-60',
    options: [
      { value: 'akmola', label: 'Акмолинская область' },
      { value: 'aktobe', label: 'Актюбинская область' },
      { value: 'almaty-region', label: 'Алматинская область' },
    ],
  },
  decorators: [
    (Story) => (
      <div>
        <p id="select-label" className="mb-2 text-body-s-medium text-text-heading">
          Область
        </p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};

export const Selected: Story = { args: { value: 'aktobe' } };

export const Uppercase: Story = {
  args: { className: 'w-60 uppercase data-placeholder:normal-case', contentClassName: 'uppercase' },
};

export const OpensWithKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(within(document.body).getByRole('option', { name: 'Актюбинская область' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};
