import { z } from 'zod';

const cmsEnvSchema = z.object({
  CMS_SERVICE_URL: z.url({ error: 'CMS_SERVICE_URL must be the cms-service address, see .env.example' }),
  CMS_REVALIDATE_TOKEN: z.string().min(32).optional(),
});

type CmsEnv = z.infer<typeof cmsEnvSchema>;

const readOptional = (name: string): string | undefined => {
  const value = process.env[name];
  return value === undefined || value === '' ? undefined : value;
};

export const readCmsEnv = (): CmsEnv =>
  cmsEnvSchema.parse({
    CMS_SERVICE_URL: process.env['CMS_SERVICE_URL'],
    CMS_REVALIDATE_TOKEN: readOptional('CMS_REVALIDATE_TOKEN'),
  });
