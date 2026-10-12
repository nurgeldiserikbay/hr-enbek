import { z } from 'zod';

import { AUDIENCES } from '@/shared/config';

export const instructionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  audience: z.enum(AUDIENCES),
  icon: z.string(),
  url: z.string(),
  pdfUrl: z.string(),
});

export type Instruction = z.infer<typeof instructionSchema>;
