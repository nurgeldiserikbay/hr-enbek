import { z } from 'zod';

const filesSchema = z.object({ kk: z.string(), ru: z.string() });

export const agreementsSchema = z.object({
  general: z.object({ title: z.string(), description: z.string(), files: filesSchema }),
  regional: z.array(z.object({ id: z.string(), title: z.string(), files: filesSchema })),
});

export type Agreements = z.infer<typeof agreementsSchema>;
