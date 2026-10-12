import { z } from 'zod';

export const labourInspectionSchema = z.object({
  regionId: z.string(),
  regionName: z.string(),
  organization: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  inspectors: z.array(z.string()),
  director: z.string().optional(),
});

export type LabourInspection = z.infer<typeof labourInspectionSchema>;
