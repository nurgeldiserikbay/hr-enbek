import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';

import type * as NcaLayer from '@/shared/lib/ncalayer';
import { NcaLayerError, signWithNcaLayer } from '@/shared/lib/ncalayer';
import { expectNoA11yViolations } from '@/shared/lib/testing';

import messages from '../../../../messages/ru.json';
import { SignatureStep } from './signature-step.tsx';

vi.mock('@/shared/lib/ncalayer', async (importOriginal) => ({
  ...(await importOriginal<typeof NcaLayer>()),
  signWithNcaLayer: vi.fn(),
}));

const challenge = (expiresAt: string) => ({
  challengeId: 'ch-1',
  dataToSign: 'text',
  dataToSignBase64: 'dGV4dA==',
  expiresAt,
});

const ACTIVE = challenge('2030-01-01T00:00:00Z');

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.mocked(signWithNcaLayer).mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderStep = (current = ACTIVE) => {
  const handlers = { onChallengeRenewed: vi.fn(), onSigned: vi.fn(), onRestart: vi.fn() };
  const { container } = render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <SignatureStep challenge={current} {...handlers} />
    </NextIntlClientProvider>,
  );
  return { ...handlers, container };
};

describe('SignatureStep', () => {
  it('FR-AUTH-40: signs the issued text with the authentication key and confirms the sign-in', async () => {
    vi.mocked(signWithNcaLayer).mockResolvedValue('MIIB');
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const { onSigned } = renderStep();

    await userEvent.click(screen.getByRole('button', { name: 'Подписать' }));

    await waitFor(() => {
      expect(onSigned).toHaveBeenCalled();
    });
    expect(signWithNcaLayer).toHaveBeenCalledWith('dGV4dA==', 'PKCS12');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/staff/verify',
      expect.objectContaining({ body: '{"cms":"MIIB"}' }),
    );
  });

  it('asks to start NCALayer when it is not running', async () => {
    vi.mocked(signWithNcaLayer).mockRejectedValue(new NcaLayerError('unavailable'));
    renderStep();

    await userEvent.click(screen.getByRole('button', { name: 'Подписать' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('NCALayer не запущен');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not treat a closed key dialog as an error', async () => {
    vi.mocked(signWithNcaLayer).mockRejectedValue(new NcaLayerError('cancelled'));
    renderStep();

    await userEvent.click(screen.getByRole('button', { name: 'Подписать' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Подписать' })).toBeEnabled();
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('offers a new text after the challenge expires', async () => {
    const renewed = challenge('2030-01-01T00:03:00Z');
    fetchMock.mockResolvedValue(Response.json({ challenge: renewed }));
    const { onChallengeRenewed } = renderStep(challenge('2020-01-01T00:00:00Z'));

    await userEvent.click(await screen.findByRole('button', { name: 'Получить новый текст' }));

    await waitFor(() => {
      expect(onChallengeRenewed).toHaveBeenCalledWith(renewed);
    });
  });

  it('FR-AUTH-30: returns to the password step when the intermediate session expires', async () => {
    vi.mocked(signWithNcaLayer).mockResolvedValue('MIIB');
    fetchMock.mockResolvedValue(
      Response.json({ status: 401, code: 'auth.2fa.challenge.expired', message: 'Срок истёк' }, { status: 401 }),
    );
    const { onRestart } = renderStep();

    await userEvent.click(screen.getByRole('button', { name: 'Подписать' }));

    await waitFor(() => {
      expect(onRestart).toHaveBeenCalledWith('Время на подтверждение входа истекло. Войдите заново.');
    });
  });

  it('IR-UI-07: has no accessibility violations', async () => {
    const { container } = renderStep();

    await expectNoA11yViolations(container);
  });
});
