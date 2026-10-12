import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { expectNoA11yViolations } from '@/shared/lib/testing';

import messages from '../../../../messages/ru.json';
import { StaffSignInForm } from './staff-sign-in-form.tsx';

vi.mock('@/shared/config', () => ({
  ROUTES: { helpAgreements: '/help/agreements' },
  Link: ({ href, children }: Readonly<{ href: string; children: ReactNode }>) => <a href={href}>{children}</a>,
}));

const renderForm = () =>
  render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <StaffSignInForm />
    </NextIntlClientProvider>,
  );

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
    expect(submit).toBeEnabled();
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

    await expectNoA11yViolations(container);
  });
});
