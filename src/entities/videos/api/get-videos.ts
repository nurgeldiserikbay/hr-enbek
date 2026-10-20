import { z } from 'zod';

import { requestCms, toCmsAudience } from '@/shared/api';
import type { Audience, Locale } from '@/shared/config';

import type { Video } from '../model/video.ts';
import { videoSchema } from './video-schema.ts';

interface VideoFilter {
  locale: Locale;
  query?: string | undefined;
  audience?: Audience | undefined;
}

export async function getVideos({ locale, query, audience }: VideoFilter): Promise<Video[]> {
  return z.array(videoSchema).parse(
    await requestCms({
      path: '/api/v1/public/video-instructions',
      locale,
      sections: ['video-instructions'],
      query: { audience: toCmsAudience(audience), q: query },
    }),
  );
}
