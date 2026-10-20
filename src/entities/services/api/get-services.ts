import { z } from 'zod';

import { requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { Service } from '../model/service.ts';
import { serviceSchema } from './service-schema.ts';

export async function getServices(locale: Locale): Promise<Service[]> {
  return z
    .array(serviceSchema)
    .parse(await requestCms({ path: '/api/v1/public/services', locale, sections: ['services'] }));
}
