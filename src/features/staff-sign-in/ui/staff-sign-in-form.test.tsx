import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';

import { expectNoA11yViolations } from '@/shared/lib/testing';

import messages from '../../../../messages/ru.json';
import { StaffSignInForm } from './staff-sign-in-form.tsx';

const AGREEMENT = { id: 'agr-1', version: '3', title: 'Пользовательское соглашение', body: 'Текст соглашения' };
const CHALLENGE = {
  challengeId: 'ch-1',
  dataToSign: 'text',
  dataToSignBase64: 'dGV4dA==',
  expiresAt: '2030-01-01T00:00:00Z',
};

const json = (status: number, body: unknown) => Response.json(body, { status });

const urlOf = (input: RequestInfo | URL) => (input instanceof Request ? input.url : input.toString());

const answerAgreementOr = (other: Response) => (input: RequestInfo | URL) =>
  Promise.resolve(urlOf(input).startsWith('/api/auth/agreement') ? json(200, AGREEMENT) : other);

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockImplementation(answerAgreementOr(json(404, {})));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderForm = (onChallenge = vi.fn()) => {
  const { container } = render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <StaffSignInForm onChallenge={onChallenge} />
    </NextIntlClientProvider>,
  );
  return { onChallenge, container };
};

const fillCredentials = async () => {
  await userEvent.type(screen.getByLabelText('ИИН или логин'), 'inspector1');
  await userEvent.type(screen.getByLabelText('Пароль'), 'secret-password');
  await userEvent.click(screen.getByRole('checkbox', { name: 'Я принимаю' }));
};

describe('StaffSignInForm', () => {
  it('FR-AUTH-21: agreement checkbox is not pre-filled', () => {
    renderForm();

    expect(screen.getByRole('checkbox', { name: 'Я принимаю' })).not.toBeChecked();
  });

  it('FR-AUTH-22: sign-in button stays disabled until the agreement is accepted', async () => {
    renderForm();
    const submit = screen.getByRole('button', { name: 'Войти' });

    expect(submit).toBeDisabled();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Я принимаю' }));
    await waitFor(() => {
      expect(submit).toBeEnabled();
    });
  });

  it('FR-AUTH-20: shows the agreement text loaded from the service', async () => {
    renderForm();

    await userEvent.click(await screen.findByRole('button', { name: 'пользовательское соглашение.' }));

    expect(screen.getByRole('heading', { name: AGREEMENT.title, hidden: true })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/agreement?lang=ru');
  });

  it('FR-AUTH-30: sends credentials with the accepted agreement version and opens the signature step', async () => {
    const { onChallenge } = renderForm();
    fetchMock.mockImplementation(answerAgreementOr(json(200, { challenge: CHALLENGE })));
    await screen.findByRole('button', { name: 'пользовательское соглашение.' });

    await fillCredentials();
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(onChallenge).toHaveBeenCalledWith(CHALLENGE);
    });
    const [, init] = fetchMock.mock.calls.find(([input]) => input === '/api/auth/staff/login') ?? [];
    expect(typeof init?.body === 'string' ? JSON.parse(init.body) : undefined).toEqual({
      login: 'inspector1',
      password: 'secret-password',
      agreementAccepted: true,
      agreementId: 'agr-1',
      agreementVersion: '3',
    });
  });

  it('FR-AUTH-26: shows the single message returned for wrong credentials', async () => {
    renderForm();
    fetchMock.mockImplementation(
      answerAgreementOr(json(401, { status: 401, code: 'auth.bad.credentials', message: 'Неверный логин или пароль' })),
    );
    await screen.findByRole('button', { name: 'пользовательское соглашение.' });

    await fillCredentials();
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Неверный логин или пароль');
  });

  it('shows and hides the password', async () => {
    renderForm();
    const password = screen.getByLabelText('Пароль');
    const toggle = screen.getByRole('button', { name: 'Показать пароль' });

    expect(password).toHaveAttribute('type', 'password');

    await userEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('IR-UI-07: has no accessibility violations', async () => {
    const { container } = renderForm();
    await screen.findByRole('button', { name: 'пользовательское соглашение.' });

    await expectNoA11yViolations(container);
  });
});
