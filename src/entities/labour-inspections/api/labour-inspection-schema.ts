import { z } from 'zod';

import { cmsContentLanguageShape } from '@/shared/api';

import type { InspectionDepartment } from '../model/labour-inspection.ts';

type InspectionGroupCode = 'name' | 'addr' | 'phone' | 'mail' | 'inspec' | 'head';

const inspectionGroupSchema = z.object({
  code: z.string(),
  values: z.array(z.object({ value: z.string() })),
});

export const inspectionRegionSchema = z.object({
  code: z.string().min(1),
  name: z.string(),
  langUsed: cmsContentLanguageShape.langUsed,
});

export const inspectionSchema = z
  .object({
    regionCode: z.string().min(1),
    langUsed: cmsContentLanguageShape.langUsed,
    groups: z.array(inspectionGroupSchema),
  })
  .transform(({ regionCode, langUsed, groups }) => {
    const valuesOf = (code: InspectionGroupCode) =>
      groups.filter((group) => group.code === code).flatMap(({ values }) => values.map(({ value }) => value));
    const department: InspectionDepartment = {
      organization: valuesOf('name')[0],
      address: valuesOf('addr')[0],
      phone: valuesOf('phone')[0],
      email: valuesOf('mail')[0],
      inspectors: valuesOf('inspec'),
      director: valuesOf('head')[0],
      lang: langUsed,
    };
    return { regionCode, department };
  });
