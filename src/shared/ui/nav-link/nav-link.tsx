'use client';

import type { ComponentProps } from 'react';

import { Link, usePathname } from '@/shared/config';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  exact?: boolean;
};

export function NavLink({ href, exact = false, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return <Link href={href} aria-current={isActive ? 'page' : undefined} {...props} />;
}
