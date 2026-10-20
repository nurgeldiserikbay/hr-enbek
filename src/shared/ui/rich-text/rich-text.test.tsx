import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { RichTextDocument } from '@/shared/lib/rich-text';
import { expectNoA11yViolations } from '@/shared/lib/testing';

import { ARTICLE_DOCUMENT } from './rich-text.fixture.ts';
import { RichText } from './rich-text.tsx';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({
  usePathname: () => '/',
  Link: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
    <a href={`/ru${href}`} className={className}>
      {children}
    </a>
  ),
}));

const paragraphWith = (content: RichTextDocument): RichTextDocument => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [content] }],
});

describe('RichText', () => {
  it('renders editor blocks as semantic HTML', () => {
    render(<RichText document={ARTICLE_DOCUMENT} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Что проверить в кадровом учёте' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Порядок действий' })).toBeInTheDocument();
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getByRole('note')).toHaveTextContent('Размер штрафа');
    expect(screen.getByRole('link', { name: 'eGov' })).toHaveAttribute('target', '_blank');
  });

  it('FR-MAIN-05: renders markup and scripts from the editor as text', () => {
    const { container } = render(
      <RichText document={paragraphWith({ type: 'text', text: '<script>alert(1)</script><b>x</b>' })} />,
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container).toHaveTextContent('<script>alert(1)</script><b>x</b>');
  });

  it('FR-MAIN-05: drops links with unsafe addresses and unknown blocks', () => {
    const { container } = render(
      <RichText
        document={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Ссылка', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] },
              ],
            },
            { type: 'iframe', attrs: { src: 'https://evil.example' } },
          ],
        }}
      />,
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('keeps site links inside the current language', () => {
    render(
      <RichText
        document={paragraphWith({
          type: 'text',
          text: 'Самопроверка',
          marks: [{ type: 'link', attrs: { href: '/self-check' } }],
        })}
      />,
    );

    expect(screen.getByRole('link', { name: 'Самопроверка' })).toHaveAttribute('href', '/ru/self-check');
  });

  it('IR-UI-07: gives images from the editor their text alternative', () => {
    render(
      <RichText
        document={{
          type: 'doc',
          content: [
            {
              type: 'image',
              attrs: { url: 'https://cms.example/cms/api/v1/public/files/1', width: 800, height: 450, alt: 'Схема' },
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole('img', { name: 'Схема' })).toBeInTheDocument();
  });

  it('IR-UI-07: has no axe violations', async () => {
    const { container } = render(<RichText document={ARTICLE_DOCUMENT} />);

    await expectNoA11yViolations(container);
  });
});
