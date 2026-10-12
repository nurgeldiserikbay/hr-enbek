import Image from 'next/image';
import type { ReactNode } from 'react';

import { Card } from '@/shared/ui/card';
import { Clock, Play } from '@/shared/ui/icon';

import type { Video } from '../model/video.ts';

const SECONDS_IN_MINUTE = 60;

const formatDuration = (seconds: number) =>
  `${String(Math.floor(seconds / SECONDS_IN_MINUTE))}:${String(seconds % SECONDS_IN_MINUTE).padStart(2, '0')}`;

type VideoCardProps = Readonly<{
  video: Video;
  badge: ReactNode;
}>;

export function VideoCard({ video, badge }: VideoCardProps) {
  return (
    <Card asChild className="relative overflow-hidden">
      <article>
        <div className="relative aspect-[3/2] bg-surface-page lg:aspect-[486/240]">
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 486px, 100vw"
            className="object-cover"
          />
          <span className="absolute top-1/2 left-1/2 flex size-14 -translate-1/2 items-center justify-center rounded-full bg-surface-card text-text-heading shadow-floating lg:size-16">
            <Play aria-hidden="true" className="ml-0.5 size-6" />
          </span>
          <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-overlay-dark-80 px-2 py-0.5 text-label text-text-inverse">
            <Clock aria-hidden="true" className="size-3" />
            <time dateTime={`PT${String(video.durationSeconds)}S`}>{formatDuration(video.durationSeconds)}</time>
          </span>
        </div>
        <div className="flex flex-col gap-2 p-4 lg:px-6 lg:pt-5 lg:pb-6">
          {badge}
          <h3 className="text-h5 font-semibold text-text-heading">
            <a
              href={video.url}
              className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand-primary-text"
            >
              {video.title}
            </a>
          </h3>
        </div>
      </article>
    </Card>
  );
}
