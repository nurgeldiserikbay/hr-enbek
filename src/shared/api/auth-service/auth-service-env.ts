import { z } from 'zod';

const authServiceEnvSchema = z.object({
  AUTH_SERVICE_URL: z.url(),
  AUTH_CLIENT_ID: z
    .string()
    .regex(/^[\w.-]{1,64}$/u)
    .default('hr-enbek-web'),
});

const passportUrlSchema = z.url().default('https://testpass.enbek.kz');

type AuthServiceEnv = z.infer<typeof authServiceEnvSchema>;

export const readAuthServiceEnv = (): AuthServiceEnv =>
  authServiceEnvSchema.parse({
    AUTH_SERVICE_URL: process.env['AUTH_SERVICE_URL'],
    AUTH_CLIENT_ID: process.env['AUTH_CLIENT_ID'],
  });

export const readPassportUrl = (): string => passportUrlSchema.parse(process.env['PASSPORT_URL']);
