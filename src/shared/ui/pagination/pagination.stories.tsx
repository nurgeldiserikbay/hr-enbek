import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Pagination } from './pagination.tsx';

const meta = {
  title: 'shared/ui/Pagination',
  component: Pagination,
  args: {
    currentPage: 1,
    pageCount: 8,
    hrefForPage: (page) => `?page=${String(page)}`,
    label: 'Страницы',
    previousLabel: 'Предыдущая страница',
    nextLabel: 'Следующая страница',
    pageLabel: (page) => `Страница ${String(page)}`,
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};

export const MiddlePage: Story = { args: { currentPage: 5, pageCount: 12 } };

export const LastPage: Story = { args: { currentPage: 8 } };

export const FewPages: Story = { args: { currentPage: 2, pageCount: 3 } };
