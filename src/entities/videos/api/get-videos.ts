import { z } from 'zod';

import type { Audience } from '@/shared/config';
import { matchesQuery } from '@/shared/lib/search';

import { type Video, videoSchema } from '../model/video.ts';
import { VIDEOS_MOCK } from './videos.mock.ts';

interface VideoFilter {
  query?: string | undefined;
  audience?: Audience | undefined;
}

export function getVideos({ query, audience }: VideoFilter = {}): Promise<Video[]> {
  return Promise.resolve(
    z
      .array(videoSchema)
      .parse(VIDEOS_MOCK)
      .filter((video) => audience === undefined || video.audience === audience)
      .filter(({ title }) => matchesQuery(query, title)),
  );
}
