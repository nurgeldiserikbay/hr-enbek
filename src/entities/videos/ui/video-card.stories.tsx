import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from '@/shared/ui/tag';

import { VideoCard } from './video-card.tsx';

const meta = {
  title: 'entities/videos/VideoCard',
  component: VideoCard,
  args: {
    badge: <Tag size="sm">Работодателю</Tag>,
    video: {
      id: '5b1c2d3e-4f50-4a6b-8c7d-9e0f1a2b3c4d',
      title: 'Регистрация трудового договора',
      audience: 'employer',
      durationSeconds: 252,
      thumbnailUrl: '/mock/videos/thumbnail.jpg',
      url: 'https://www.youtube.com/@enbekkz',
      language: { lang: 'ru', fallbackFields: [] },
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

export const WithoutPreviewAndDuration: StoryObj<typeof meta> = {
  args: {
    video: { ...meta.args.video, thumbnailUrl: undefined, durationSeconds: undefined },
  },
};
