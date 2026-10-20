import { z } from 'zod';

import { requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { LabourInspection } from '../model/labour-inspection.ts';
import { inspectionRegionSchema, inspectionSchema } from './labour-inspection-schema.ts';

export async function getLabourInspections(locale: Locale): Promise<LabourInspection[]> {
  const [regions, inspections] = await Promise.all([
    requestCms({ path: '/api/v1/public/regions', locale, sections: ['regions'] }).then((body) =>
      z.array(inspectionRegionSchema).parse(body),
    ),
    requestCms({ path: '/api/v1/public/labor-inspections', locale, sections: ['labor-inspections'] }).then((body) =>
      z.array(inspectionSchema).parse(body),
    ),
  ]);
  const departments = new Map(inspections.map(({ regionCode, department }) => [regionCode, department]));
  return regions.map(({ code, name, langUsed }) => ({
    regionId: code,
    regionName: name,
    regionLang: langUsed,
    department: departments.get(code),
  }));
}
