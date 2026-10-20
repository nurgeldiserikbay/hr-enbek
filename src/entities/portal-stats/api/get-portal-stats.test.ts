import { portalStatsSchema } from './get-portal-stats.ts';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const indicator = (overrides: Record<string, unknown>) => ({
  code: 'contracts_active',
  title: 'Действующие трудовые договоры',
  langUsed: 'ru',
  unit: 'COUNT',
  value: 6_900_000,
  periodFrom: null,
  periodTo: '2026-10-19',
  calculatedAt: '2026-10-19T07:05:00Z',
  isStale: false,
  sortOrder: 10,
  ...overrides,
});

describe('portalStatsSchema', () => {
  it('FR-MAIN-20: keeps the order set by the editor and the time of the oldest calculation', () => {
    const stats = portalStatsSchema.parse([
      indicator({ code: 'employees', sortOrder: 30, calculatedAt: '2026-10-19T07:05:00Z' }),
      indicator({ code: 'contracts', sortOrder: 10, calculatedAt: '2026-10-19T06:00:00Z', unit: null }),
      indicator({ code: 'share', sortOrder: 20, unit: 'PERCENT', value: 12.5 }),
    ]);

    expect(stats.indicators.map(({ code }) => code)).toEqual(['contracts', 'share', 'employees']);
    expect(stats.indicators.map(({ unit }) => unit)).toEqual(['count', 'percent', 'count']);
    expect(stats.calculatedAt).toBe('2026-10-19T06:00:00Z');
    expect(stats.isStale).toBe(false);
  });

  it('FR-MAIN-23: marks the block when any value was kept from the last successful calculation', () => {
    expect(portalStatsSchema.parse([indicator({}), indicator({ code: 'b', isStale: true })]).isStale).toBe(true);
  });

  it('shows nothing until the indicators are calculated', () => {
    expect(portalStatsSchema.parse([])).toEqual({ indicators: [], calculatedAt: undefined, isStale: false });
  });
});
