import { z } from 'zod';

export const agreementSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  version: z.union([z.string(), z.number()]),
  title: z.string(),
  body: z.string(),
});

export type Agreement = z.infer<typeof agreementSchema>;
