import { agreementSchema } from './agreement-schema.ts';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const file = (id: string) => ({
  id,
  url: `https://cms.example/cms/api/v1/public/files/${id}`,
  width: null,
  height: null,
  thumbnailUrl: null,
});
const KK_FILE = '0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f';
const RU_FILE = '1b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f';

describe('agreementSchema', () => {
  it('names a regional agreement after its region, as in the design', () => {
    const { kind, agreement } = agreementSchema.parse({
      id: '2b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
      kind: 'REGIONAL',
      region: { code: '710000000', name: 'г. Астана', langUsed: 'ru' },
      title: 'Региональное соглашение г. Астаны на 2026–2028 годы',
      description: null,
      files: { kk: file(KK_FILE), ru: file(RU_FILE) },
      langUsed: 'ru',
    });

    expect(kind).toBe('REGIONAL');
    expect(agreement).toMatchObject({
      title: 'г. Астана',
      titleLang: 'ru',
      description: undefined,
      files: {
        kk: `https://cms.example/cms/api/v1/public/files/${KK_FILE}`,
        ru: `https://cms.example/cms/api/v1/public/files/${RU_FILE}`,
      },
    });
  });

  it('keeps an agreement whose text exists in one language only', () => {
    const { agreement } = agreementSchema.parse({
      id: '3b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
      kind: 'GENERAL',
      title: 'Генеральное соглашение',
      files: { kk: file(KK_FILE), ru: null },
      langUsed: 'ru',
    });

    expect(agreement.files).toEqual({ kk: `https://cms.example/cms/api/v1/public/files/${KK_FILE}`, ru: undefined });
  });
});
