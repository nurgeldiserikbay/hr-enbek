import { inspectionSchema } from './labour-inspection-schema.ts';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const group = (code: string, ...values: string[]) => ({
  code,
  name: code,
  langUsed: 'ru',
  values: values.map((value) => ({ value, langUsed: 'ru' })),
});

describe('inspectionSchema', () => {
  it('FR-MAIN-30: shows every group of the department, all inspectors included', () => {
    const { regionCode, department } = inspectionSchema.parse({
      regionCode: '750000000',
      regionName: 'г. Алматы',
      langUsed: 'ru',
      groups: [
        group('name', 'Департамент по городу Алматы'),
        group('addr', 'пр. Абая, 1'),
        group('phone', '+77270000000'),
        group('mail', 'almaty@enbek.kz'),
        group('inspec', 'Иванов Иван Иванович', 'Петрова Анна Сергеевна'),
        group('head', 'Сеитов Нурлан'),
      ],
    });

    expect(regionCode).toBe('750000000');
    expect(department).toEqual({
      organization: 'Департамент по городу Алматы',
      address: 'пр. Абая, 1',
      phone: '+77270000000',
      email: 'almaty@enbek.kz',
      inspectors: ['Иванов Иван Иванович', 'Петрова Анна Сергеевна'],
      director: 'Сеитов Нурлан',
      lang: 'ru',
    });
  });

  it('leaves out the groups the administrator has not filled', () => {
    const { department } = inspectionSchema.parse({
      regionCode: '110000000',
      regionName: 'Акмолинская область',
      langUsed: 'kk',
      groups: [group('name', 'Ақмола облысы бойынша департамент')],
    });

    expect(department).toMatchObject({ address: undefined, email: undefined, inspectors: [], director: undefined });
  });
});
