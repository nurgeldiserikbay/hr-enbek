import type { ReactNode } from 'react';

import { Link } from '@/shared/config';

type ContentLinkProps = Readonly<{
  href: string;
  className?: string;
  lang?: string | undefined;
  children: ReactNode;
}>;

const isSiteRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

const NEW_TAB_PROPS = { target: '_blank', rel: 'noopener noreferrer' } as const;

const isExternal = (href: string) => /^https?:\/\//iu.test(href);

export function ContentLink({ href, className, lang, children }: ContentLinkProps) {
  if (isSiteRoute(href)) {
    return (
      <Link href={href} className={className} lang={lang}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} lang={lang} {...(isExternal(href) ? NEW_TAB_PROPS : {})}>
      {children}
    </a>
  );
}
