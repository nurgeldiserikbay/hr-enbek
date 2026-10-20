import { z } from 'zod';

import { cmsContentLanguageShape, cmsFileSchema, cmsOptionalTextSchema, toContentLanguage } from '@/shared/api';

import type { Service, ServiceAction, ServiceFlowStep } from '../model/service.ts';

const flowStepSchema = z
  .object({ icon: cmsOptionalTextSchema, title: z.string(), text: cmsOptionalTextSchema })
  .transform(({ icon, title, text }): ServiceFlowStep => ({ icon, title, text }));

const actionSchema = z
  .object({ label: z.string(), url: cmsOptionalTextSchema, file: cmsFileSchema.nullish() })
  .transform(({ label, url, file }): ServiceAction | undefined => {
    const href = url ?? file?.url;
    return href === undefined ? undefined : { label, href };
  });

export const serviceSchema = z
  .object({
    id: z.uuid(),
    icon: cmsOptionalTextSchema,
    title: z.string(),
    subtitle: cmsOptionalTextSchema,
    description: cmsOptionalTextSchema,
    features: z.array(z.string()),
    flow: z.array(flowStepSchema),
    action: actionSchema.nullish(),
    ...cmsContentLanguageShape,
  })
  .transform(({ id, icon, title, subtitle, description, features, flow, action, ...language }): Service => ({
    id,
    icon,
    title,
    subtitle,
    description,
    features,
    flow,
    action: action ?? undefined,
    language: toContentLanguage(language),
  }));
