import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './logo.tsx';

const meta = {
  title: 'shared/ui/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Header: Story = {
  render: () => (
    <span className="text-text-heading">
      <Logo />
    </span>
  ),
};

export const Footer: Story = {
  render: () => (
    <span className="block bg-surface-dark p-6 text-text-inverse">
      <Logo className="h-[2.25rem] w-[6.3rem]" />
    </span>
  ),
};

export const Hero: Story = {
  render: () => (
    <span className="block bg-brand-primary p-6 text-text-inverse">
      <Logo variant="hero" />
    </span>
  ),
};
