import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { expectNoA11yViolations } from '@/shared/lib/testing';

import { Dropdown } from './dropdown.tsx';

const renderDropdown = () =>
  render(
    <>
      <Dropdown trigger="Справочная">
        <a href="#faq">Вопросы и ответы</a>
      </Dropdown>
      <p>Снаружи</p>
    </>,
  );

const details = () => screen.getByText('Справочная').closest('details');

describe('Dropdown', () => {
  it('IR-UI-07: closes on Escape and returns focus to the trigger', async () => {
    renderDropdown();

    await userEvent.click(screen.getByText('Справочная'));
    expect(details()).toHaveAttribute('open');

    await userEvent.keyboard('{Escape}');
    expect(details()).not.toHaveAttribute('open');
    expect(screen.getByText('Справочная')).toHaveFocus();
  });

  it('closes on a click outside', async () => {
    renderDropdown();

    await userEvent.click(screen.getByText('Справочная'));
    expect(details()).toHaveAttribute('open');

    fireEvent.pointerDown(screen.getByText('Снаружи'));
    expect(details()).not.toHaveAttribute('open');
  });

  it('closes after a link inside is activated', async () => {
    renderDropdown();

    await userEvent.click(screen.getByText('Справочная'));
    await userEvent.click(screen.getByRole('link', { name: 'Вопросы и ответы' }));

    expect(details()).not.toHaveAttribute('open');
  });

  it('IR-UI-07: has no axe violations', async () => {
    const { container } = renderDropdown();

    await expectNoA11yViolations(container);
  });
});
