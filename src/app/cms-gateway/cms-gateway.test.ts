import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

import { postCmsRevalidate } from './revalidate-handler.ts';

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }));
vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const TOKEN = 'a'.repeat(32);

const revalidateRequest = (body: unknown, authorization = `Bearer ${TOKEN}`) =>
  new NextRequest('http://localhost:3000/api/cms/revalidate', {
    method: 'POST',
    headers: { authorization, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.stubEnv('CMS_SERVICE_URL', 'https://cms.internal/cms');
  vi.stubEnv('CMS_REVALIDATE_TOKEN', TOKEN);
  vi.mocked(revalidateTag).mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('postCmsRevalidate', () => {
  it('FR-MAIN-02: drops the cached sections the CMS reports as changed', async () => {
    const response = await postCmsRevalidate(revalidateRequest({ sections: ['news', 'faq', 'news'] }));

    expect(response.status).toBe(204);
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith('cms:news', { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith('cms:faq', { expire: 0 });
  });

  it('rejects a call without the shared secret', async () => {
    const response = await postCmsRevalidate(revalidateRequest({ sections: ['news'] }, 'Bearer wrong'));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects unknown sections', async () => {
    const response = await postCmsRevalidate(revalidateRequest({ sections: ['users'] }));

    expect(response.status).toBe(400);
  });

  it('is switched off until the secret is configured', async () => {
    vi.stubEnv('CMS_REVALIDATE_TOKEN', '');

    const response = await postCmsRevalidate(revalidateRequest({ sections: ['news'] }));

    expect(response.status).toBe(404);
  });
});
