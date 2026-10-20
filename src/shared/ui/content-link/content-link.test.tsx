import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ContentLink } from './content-link.tsx';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({
  usePathname: () => '/',
  Link: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
    <a href={`/kk${href}`} className={className}>
      {children}
    </a>
  ),
}));

describe('ContentLink', () => {
  it('opens site pages in the current language', () => {
    render(<ContentLink href="/help/faq">Вопросы</ContentLink>);

    expect(screen.getByRole('link', { name: 'Вопросы' })).toHaveAttribute('href', '/kk/help/faq');
  });

  it('opens other sites in a new tab without access to the opener', () => {
    render(<ContentLink href="https://adilet.zan.kz">Әділет</ContentLink>);

    const link = screen.getByRole('link', { name: 'Әділет' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
