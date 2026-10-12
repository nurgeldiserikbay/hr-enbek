import { type Video, VideoCard } from '@/entities/videos';
import type { Audience } from '@/shared/config';

import { AudienceFilter } from './audience-filter.tsx';
import { AudienceTag } from './audience-tag.tsx';
import { EmptyResult } from './empty-result.tsx';

type VideosContentProps = Readonly<{
  videos: readonly Video[];
  audience: Audience | undefined;
  query: string | undefined;
}>;

export function VideosContent({ videos, audience, query }: VideosContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <AudienceFilter section="videos" audience={audience} query={query} />
      {videos.length === 0 && <EmptyResult />}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} badge={<AudienceTag audience={video.audience} />} />
        ))}
      </div>
    </div>
  );
}
