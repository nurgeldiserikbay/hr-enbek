import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Download, FilePen, Files } from '@/shared/ui/icon';

import { Button } from '../button/button.tsx';
import { Tag } from '../tag/tag.tsx';
import { FeatureCard } from './feature-card.tsx';

const meta = {
  title: 'shared/ui/FeatureCard',
  component: FeatureCard,
  args: {
    icon: <Files />,
    title: 'Шаблонные договоры',
    description: 'Готовые формы трудовых договоров и соглашений',
    className: 'w-96',
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['stack', 'responsive'] },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-page p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBadgeAndActions: Story = {
  args: {
    icon: <FilePen />,
    title: 'Регистрация трудового договора',
    description: 'Как внести трудовой договор и дополнительное соглашение в ЕСУТД',
    badge: <Tag size="sm">Работодателю</Tag>,
    children: (
      <Button size="sm" className="h-10 px-4 font-normal">
        <Download aria-hidden="true" className="size-4" />
        Скачать PDF
      </Button>
    ),
  },
};

export const WholeCardLink: Story = {
  args: {
    icon: <FilePen />,
    title: 'Приём на работу',
    description: 'Трудовой договор, регистрация в ЕСУТД, ознакомление с актами',
    href: '/self-check/hiring',
    badge: <Tag size="sm">8 вопросов</Tag>,
  },
};
