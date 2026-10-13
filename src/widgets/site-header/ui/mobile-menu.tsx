'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LanguageMenu } from '@/features/switch-language';
import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { ChevronDown, LogOut, Menu } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { NavLink } from '@/shared/ui/nav-link';

import { EcosystemMenu } from './ecosystem-menu.tsx';
import { SectionLabel } from './section-label.tsx';

type NavigationLink = Readonly<{
  key:
    | 'about'
    | 'employer'
    | 'employee'
    | 'news'
    | 'normative'
    | 'instructions'
    | 'videos'
    | 'services'
    | 'agreements'
    | 'faq';
  href: string;
}>;

type MobileMenuProps = Readonly<{
  primaryLinks: readonly NavigationLink[];
  helpLinks: readonly NavigationLink[];
}>;

const MENU_ITEM =
  'flex h-11 items-center px-3 text-body-s text-text-body hover:text-brand-primary aria-[current=page]:text-brand-primary';
const SUBMENU_ITEM =
  'flex h-10 items-center px-3 text-body-s text-text-body hover:text-brand-primary aria-[current=page]:text-brand-primary';

export function MobileMenu({ primaryLinks, helpLinks }: MobileMenuProps) {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={open}
        className="flex size-10 items-center justify-center rounded-md bg-surface-page text-text-heading lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">{t('menu')}</span>
      </button>

      <Dialog isOpen={isOpen} onClose={close} layout="fullscreen" aria-label={t('menu')} className="lg:hidden">
        <div className="flex items-center pt-15 pr-6 pl-13">
          <Link href={ROUTES.home} aria-label={t('home')} onClick={close} className="text-brand-logo-ink">
            <Logo />
          </Link>
          <EcosystemMenu className="ml-6" />
          <button type="button" onClick={close} className="-m-2 ml-auto rounded-md p-2 text-text-heading">
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">{t('closeMenu')}</span>
          </button>
        </div>

        <nav
          aria-label={t('label')}
          className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-8 pt-9.5 pb-6"
        >
          <ul>
            {primaryLinks.map(({ key, href }) => (
              <li key={key}>
                <NavLink href={href} onClick={close} className={MENU_ITEM}>
                  {t(key)}
                </NavLink>
              </li>
            ))}
            <li>
              <details className="group">
                <summary className={`${MENU_ITEM} cursor-pointer list-none gap-2 [&::-webkit-details-marker]:hidden`}>
                  <SectionLabel prefix={ROUTES.help}>{t('help')}</SectionLabel>
                  <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="pb-1 pl-4">
                  {helpLinks.map(({ key, href }) => (
                    <li key={key}>
                      <NavLink href={href} onClick={close} className={SUBMENU_ITEM}>
                        {t(key)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <NavLink href={ROUTES.news} onClick={close} className={MENU_ITEM}>
                {t('news')}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col items-start px-8 pb-13.25">
          <LanguageMenu side="top" />
          <Button asChild className="mt-2.5 h-9 rounded-md px-3 text-body-s font-normal">
            <Link href={ROUTES.login} onClick={close}>
              <LogOut aria-hidden="true" className="size-4" />
              {t('login')}
            </Link>
          </Button>
        </div>
      </Dialog>
    </>
  );
}
