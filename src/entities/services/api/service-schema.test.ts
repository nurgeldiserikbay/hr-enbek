import { serviceSchema } from './service-schema.ts';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const service = (overrides: Record<string, unknown>) =>
  serviceSchema.parse({
    id: '01a152bc-2870-728a-b2b5-bbae91a56201',
    icon: 'refresh-cw',
    title: 'Синхронизация трудовых договоров',
    subtitle: null,
    description: null,
    features: [],
    flow: [
      { icon: 'database', title: 'Кадровая система', text: '1С, SAP и другие' },
      { icon: null, title: 'ЕСУТД', text: null },
    ],
    action: null,
    langUsed: 'ru',
    ...overrides,
  });

describe('serviceSchema', () => {
  it('keeps the flow steps in order with optional icons and captions', () => {
    expect(service({}).flow).toEqual([
      { icon: 'database', title: 'Кадровая система', text: '1С, SAP и другие' },
      { icon: undefined, title: 'ЕСУТД', text: undefined },
    ]);
  });

  it('leads the button to the link or to the attached document', () => {
    expect(service({ action: { label: 'Документация', url: '/help/instructions', file: null } }).action).toEqual({
      label: 'Документация',
      href: '/help/instructions',
    });
    expect(
      service({
        action: {
          label: 'Документация',
          url: null,
          file: {
            id: '0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
            url: 'https://cms.example/cms/api/v1/public/files/0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
            width: null,
            height: null,
            thumbnailUrl: null,
          },
        },
      }).action?.href,
    ).toBe('https://cms.example/cms/api/v1/public/files/0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f');
  });
});
