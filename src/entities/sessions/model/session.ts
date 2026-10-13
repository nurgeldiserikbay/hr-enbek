import { z } from 'zod';

const identifierSchema = z.union([z.string(), z.number()]).transform(String);

const permissionsByScopeSchema = z.record(z.string(), z.array(z.string())).catch({});

const roleAssignmentSchema = z.object({
  code: z.string(),
  govOrgId: identifierSchema.nullish(),
  katoCode: z.string().nullish(),
  employerBin: z.string().nullish(),
});

export const sessionUserSchema = z.object({
  userId: identifierSchema,
  sessionId: identifierSchema,
  authType: z.enum(['GOV_2FA', 'PASSPORT_SSO']),
  authLevel: z.enum(['PASSWORD_ECP', 'PASSPORT']),
  login: z.string().nullish(),
  displayName: z.string().nullish(),
  govOrgId: identifierSchema.nullish(),
  iinMasked: z.string().nullish(),
  iinVerified: z.boolean().catch(false),
  roles: z.array(roleAssignmentSchema).catch([]),
  permissions: z.array(z.string()).catch([]),
  orgPermissions: permissionsByScopeSchema,
  regionPermissions: permissionsByScopeSchema,
  employerBins: z.array(z.string()).catch([]),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

export const sessionSchema = z.object({
  accessToken: z.string(),
  accessExpiresAt: z.iso.datetime({ offset: true }),
  passwordChangeRequired: z.boolean(),
  user: sessionUserSchema,
});

export type Session = z.infer<typeof sessionSchema>;

export const signatureChallengeSchema = z.object({
  challengeId: z.string(),
  dataToSign: z.string(),
  dataToSignBase64: z.string(),
  expiresAt: z.iso.datetime({ offset: true }),
});

export type SignatureChallenge = z.infer<typeof signatureChallengeSchema>;
