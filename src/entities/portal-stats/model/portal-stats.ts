import { z } from 'zod';

export const portalStatsSchema = z.object({
  contracts: z.number().int().nonnegative(),
  employers: z.number().int().nonnegative(),
  employees: z.number().int().nonnegative(),
});

export type PortalStats = z.infer<typeof portalStatsSchema>;
