import { type PortalStats, portalStatsSchema } from '../model/portal-stats.ts';
import { PORTAL_STATS_MOCK } from './portal-stats.mock.ts';

export function getPortalStats(): Promise<PortalStats> {
  return Promise.resolve(portalStatsSchema.parse(PORTAL_STATS_MOCK));
}
