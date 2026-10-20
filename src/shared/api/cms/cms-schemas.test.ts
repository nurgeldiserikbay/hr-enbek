import { cmsFileSchema, cmsRichTextSchema } from './cms-schemas.ts';

const FILE_ID = '0199f0a2-7b1c-7d3e-8f40-123456789abc';
const FILE_PATH = `/cms/api/v1/public/files/${FILE_ID}`;
const FILE_URL = `https://ehr.enbek.kz${FILE_PATH}`;

describe('cmsFileSchema', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('keeps an absolute file url', () => {
    vi.stubEnv('CMS_PUBLIC_URL', 'https://other.example/cms');

    expect(cmsFileSchema.parse({ id: FILE_ID, url: FILE_URL }).url).toBe(FILE_URL);
  });

  it('resolves a root path against the public cms address', () => {
    vi.stubEnv('CMS_PUBLIC_URL', 'https://ehr.enbek.kz/cms');

    const file = cmsFileSchema.parse({
      id: FILE_ID,
      url: FILE_PATH,
      width: 1600,
      height: 900,
      thumbnailUrl: `${FILE_PATH}/thumbnail`,
    });

    expect(file).toEqual({ url: FILE_URL, width: 1600, height: 900, thumbnailUrl: `${FILE_URL}/thumbnail` });
  });

  it('rejects a root path when the public cms address is not set', () => {
    vi.stubEnv('CMS_PUBLIC_URL', '');

    expect(cmsFileSchema.safeParse({ id: FILE_ID, url: FILE_PATH }).success).toBe(false);
  });
});

describe('cmsRichTextSchema', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('resolves image urls in nested nodes', () => {
    vi.stubEnv('CMS_PUBLIC_URL', 'https://ehr.enbek.kz/cms');
    const image = { type: 'image', attrs: { fileId: FILE_ID, alt: 'Схема', url: FILE_PATH, width: 1200, height: 630 } };

    const document = cmsRichTextSchema.parse({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Текст' }] }, image],
    });

    expect(document.content?.[1]).toEqual({ ...image, attrs: { ...image.attrs, url: FILE_URL } });
    expect(document.content?.[0]).toEqual({ type: 'paragraph', content: [{ type: 'text', text: 'Текст' }] });
  });
});
