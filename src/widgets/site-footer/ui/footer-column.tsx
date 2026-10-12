import type { ReactNode } from 'react';

import { Link } from '@/shared/config';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

type FooterColumnProps = Readonly<{
  id: string;
  title: string;
  links: readonly FooterLink[];
  children?: ReactNode;
}>;

export function FooterColumn({ id, title, links, children }: FooterColumnProps) {
  return (
    <div className="lg:row-span-2">
      <nav aria-labelledby={id}>
        <h3 id={id} className="mb-3 text-overline tracking-[0.06em] text-text-inverse uppercase lg:mb-4">
          {title}
        </h3>
        <ul className="flex flex-col gap-2.5 text-body-s text-text-placeholder lg:gap-3">
          {links.map(({ label, href, isExternal = false }) => (
            <li key={href}>
              {isExternal ? (
                <a href={href} className="hover:text-text-inverse">
                  {label}
                </a>
              ) : (
                <Link href={href} className="hover:text-text-inverse">
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </div>
  );
}
