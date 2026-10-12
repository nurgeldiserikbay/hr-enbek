'use client';

import type { ReactNode } from 'react';

import { usePathname } from '@/shared/config';

type SectionLabelProps = Readonly<{
  prefix: string;
  children: ReactNode;
}>;

export function SectionLabel({ prefix, children }: SectionLabelProps) {
  const pathname = usePathname();
  const isActive = pathname === prefix || pathname.startsWith(`${prefix}/`);

  return <span className={isActive ? 'text-brand-primary' : undefined}>{children}</span>;
}
