import Image from 'next/image';
import { useNow, useTranslations } from 'next-intl';

import { FeedbackTrigger } from '@/features/send-feedback';
import { LanguageMenu } from '@/features/switch-language';
import { ECOSYSTEM_LINK_KEYS, EXTERNAL_LINKS, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Facebook, Instagram } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';

import appQr from './app-qr.png';
import { FooterColumn } from './footer-column.tsx';

const MAIN_LINKS = [
  { key: 'contracts', href: ROUTES.contracts },
  { key: 'staffing', href: ROUTES.staffing },
  { key: 'consultant', href: ROUTES.consultant },
  { key: 'services', href: ROUTES.helpServices },
] as const;

const PORTAL_LINKS = [
  { key: 'about', href: ROUTES.about },
  { key: 'employer', href: ROUTES.employer },
  { key: 'employee', href: ROUTES.employee },
  { key: 'userAgreement', href: ROUTES.helpAgreements },
  { key: 'legalActs', href: ROUTES.helpNormative },
  { key: 'help', href: ROUTES.help },
] as const;

export function SiteFooter() {
  const t = useTranslations('Footer');
  const tEcosystem = useTranslations('Ecosystem');
  const year = useNow().getFullYear();

  return (
    <footer className="bg-surface-dark text-text-inverse">
      <div className="page-container pt-10 pb-10 lg:max-w-318 lg:pt-[52px] lg:pb-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-h3 lg:text-h2 lg:font-semibold">{t('supportTitle')}</h2>
            <p className="mt-2 text-body-s lg:mt-3 lg:max-w-84 lg:text-body-m lg:font-medium">{t('supportText')}</p>
          </div>
          <Button asChild className="h-12 lg:h-11 lg:min-w-[204px] lg:rounded-md lg:px-6 lg:text-body-s lg:font-normal">
            <FeedbackTrigger>{t('supportAction')}</FeedbackTrigger>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 lg:mt-6 lg:grid-cols-4 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6">
          <div>
            <Logo variant="footer" className="text-text-inverse" />
            <p className="mt-4 text-body-s-medium leading-[18px] font-semibold">{t('tagline')}</p>
            <ul aria-label={t('socialLabel')} className="mt-6 flex gap-4 text-brand-primary">
              <li>
                <a href={EXTERNAL_LINKS.facebook} aria-label={t('facebook')} className="hover:text-text-inverse">
                  <Facebook className="size-6" />
                </a>
              </li>
              <li>
                <a href={EXTERNAL_LINKS.instagram} aria-label={t('instagram')} className="hover:text-text-inverse">
                  <Instagram className="size-6" />
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn
            id="footer-main"
            title={t('mainTitle')}
            links={MAIN_LINKS.map(({ key, href }) => ({ label: t(key), href }))}
          />
          <FooterColumn
            id="footer-portal"
            title={t('portalTitle')}
            links={[
              { label: t('constitution'), href: EXTERNAL_LINKS.constitution, isExternal: true },
              ...PORTAL_LINKS.map(({ key, href }) => ({ label: t(key), href })),
            ]}
          />
          <FooterColumn
            id="footer-ecosystem"
            title={t('ecosystemTitle')}
            links={ECOSYSTEM_LINK_KEYS.map((key) => ({
              label: tEcosystem(key),
              href: EXTERNAL_LINKS[key],
              isExternal: true,
            }))}
          >
            <div className="mt-8 flex items-center gap-4 rounded-xl bg-overlay-white-5 p-3 lg:mt-6 lg:bg-transparent lg:p-0">
              <Image src={appQr} alt={t('qrAlt')} className="size-20 rounded-[4px] bg-surface-card p-1 lg:size-25" />
              <p className="text-caption leading-[1.4] text-text-placeholder lg:max-w-40 lg:text-label lg:font-normal">
                {t('qr')}
              </p>
            </div>
          </FooterColumn>

          <div className="lg:col-start-1 lg:row-start-2">
            <p className="text-body-s-medium leading-[18px]">{t('ecollabTitle')}</p>
            <p className="mt-1 text-body-s text-text-placeholder lg:max-w-60">{t('ecollabText')}</p>
          </div>
        </div>

        <a href={EXTERNAL_LINKS.hotline} className="mt-10 inline-block lg:mt-6">
          <span className="block font-accent text-number-l leading-[1.1] text-brand-primary lg:text-number-xl">
            1414
          </span>
          <span className="mt-2 block text-body-s leading-snug lg:mt-1.5">{t('hotlineText')}</span>
        </a>

        <div className="mt-15 flex flex-col gap-3 text-label leading-snug font-normal text-text-placeholder lg:mt-3 lg:flex-row lg:justify-between lg:text-caption">
          <p>{t('copyright', { year })}</p>
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-6">
            <p className="flex gap-6">
              <span>{t('ratingZero')}</span>
              <span>{t('ratingMail')}</span>
            </p>
            <LanguageMenu tone="inverse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
