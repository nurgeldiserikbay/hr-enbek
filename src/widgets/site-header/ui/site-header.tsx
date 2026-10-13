import { useTranslations } from 'next-intl';

import { LanguageMenu } from '@/features/switch-language';
import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Dropdown } from '@/shared/ui/dropdown';
import { ChevronDown, LogOut } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { NavLink } from '@/shared/ui/nav-link';

import { EcosystemMenu } from './ecosystem-menu.tsx';
import { MENU_LINK } from './menu-link.ts';
import { MobileMenu } from './mobile-menu.tsx';
import { SectionLabel } from './section-label.tsx';

const PRIMARY_LINKS = [
  { key: 'about', href: ROUTES.about },
  { key: 'employer', href: ROUTES.employer },
  { key: 'employee', href: ROUTES.employee },
] as const;

const HELP_LINKS = [
  { key: 'normative', href: ROUTES.helpNormative },
  { key: 'instructions', href: ROUTES.helpInstructions },
  { key: 'videos', href: ROUTES.helpVideos },
  { key: 'services', href: ROUTES.helpServices },
  { key: 'agreements', href: ROUTES.helpAgreements },
  { key: 'faq', href: ROUTES.helpFaq },
] as const;

const NAV_LINK =
  'px-3 py-2 text-body-s leading-3 text-text-body hover:text-brand-primary aria-[current=page]:text-brand-primary';
export function SiteHeader() {
  const t = useTranslations('Navigation');

  return (
    <header className="border-b border-border-strong bg-surface-card lg:bg-transparent">
      <div className="flex h-15.75 items-center gap-6 px-4 lg:h-20.75 lg:px-9">
        <div className="flex items-center gap-6 lg:mt-3 lg:h-15 lg:self-start">
          <Link href={ROUTES.home} aria-label={t('home')} className="text-brand-logo-ink">
            <Logo />
          </Link>

          <EcosystemMenu className="hidden lg:block" />
        </div>

        <nav
          aria-label={t('label')}
          className="mt-3 hidden h-15 self-start border-l border-border-default pl-4 lg:flex"
        >
          <ul className="flex items-center text-body-s *:flex">
            {PRIMARY_LINKS.map(({ key, href }) => (
              <li key={key}>
                <NavLink href={href} className={NAV_LINK}>
                  {t(key)}
                </NavLink>
              </li>
            ))}
            <li>
              <Dropdown
                triggerClassName={`gap-2 ${NAV_LINK} [[open]>&>svg]:rotate-180`}
                panelClassName="w-64"
                trigger={
                  <>
                    <SectionLabel prefix={ROUTES.help}>{t('help')}</SectionLabel>
                    <ChevronDown aria-hidden="true" className="size-4 transition-transform" />
                  </>
                }
              >
                <ul>
                  {HELP_LINKS.map(({ key, href }) => (
                    <li key={key}>
                      <NavLink href={href} className={MENU_LINK}>
                        {t(key)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </Dropdown>
            </li>
            <li>
              <NavLink href={ROUTES.news} className={NAV_LINK}>
                {t('news')}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <div className="hidden lg:block">
            <LanguageMenu />
          </div>
          <Button asChild className="h-9 rounded-md px-3 text-body-m font-normal lg:text-body-s">
            <Link href={ROUTES.login}>
              <LogOut aria-hidden="true" className="size-4" />
              <span className="lg:hidden">{t('loginShort')}</span>
              <span className="hidden lg:inline">{t('login')}</span>
            </Link>
          </Button>
          <MobileMenu primaryLinks={PRIMARY_LINKS} helpLinks={HELP_LINKS} />
        </div>
      </div>
    </header>
  );
}
