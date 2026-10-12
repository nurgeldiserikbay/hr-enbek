import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SearchField } from './search-field.tsx';

const meta = {
  title: 'shared/ui/SearchField',
  component: SearchField,
  args: {
    label: 'Поиск по разделу',
    placeholder: 'Поиск по вопросам, например «ЭЦП» или «расторжение»',
    className: 'w-160',
  },
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithQuery: Story = { args: { defaultValue: 'БИН' } };
