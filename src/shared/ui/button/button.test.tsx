import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { expectNoA11yViolations } from '@/shared/lib/testing';

import { Button } from './button.tsx';

describe('Button', () => {
  it('renders a native button with type="button" by default', () => {
    render(<Button>Отправить</Button>);

    expect(screen.getByRole('button', { name: 'Отправить' })).toHaveAttribute('type', 'button');
  });

  it('IR-UI-07: is reachable and operable from the keyboard', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Отправить</Button>);

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Отправить' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders the child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="https://enbek.kz">Басты бет</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'Басты бет' })).not.toHaveAttribute('type');
  });

  it('IR-UI-07: has no axe violations', async () => {
    const { container } = render(<Button>Отправить</Button>);

    await expectNoA11yViolations(container);
  });
});
