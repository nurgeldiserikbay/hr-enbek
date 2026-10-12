import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from '@/shared/ui/tag';

import { VideoCard } from './video-card.tsx';

const meta = {
  title: 'entities/videos/VideoCard',
  component: VideoCard,
  args: {
    badge: <Tag size="sm">Работодателю</Tag>,
    video: {
      id: 'contract-registration',
      title: 'Регистрация трудового договора',
      audience: 'employer',
      durationSeconds: 252,
      thumbnailUrl: '/mock/videos/thumbnail.jpg',
      url: 'https://www.youtube.com/@enbekkz',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-122 bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoCard>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
