import { LogIn } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { getLabourInspections } from '@/entities/labour-inspections';
import { getPortalStats } from '@/entities/portal-stats';
import { EXTERNAL_LINKS, MAIN_CONTENT_ID, ROUTES } from '@/shared/config';
import { CarouselSection } from '@/shared/ui/carousel-section';
import { FeatureCard } from '@/shared/ui/feature-card';
import {
  BadgeCheck,
  Calculator,
  Database,
  FilePen,
  FileText,
  Network,
  QrCode,
  RefreshCw,
  UserCheck,
} from '@/shared/ui/icon';
import { LabourInspection } from '@/widgets/labour-inspection';
import { PageHero } from '@/widgets/page-hero';
import { PortalStats } from '@/widgets/portal-stats';
import { Showcase } from '@/widgets/showcase';

import heroDesktop from './hero-desktop.jpg';
import heroMobile from './hero-mobile.jpg';

const QUICK_ACTIONS = [
  { key: 'account', icon: <LogIn />, href: ROUTES.login },
  { key: 'registry', icon: <BadgeCheck />, href: ROUTES.helpServices },
] as const;

const EMPLOYEE_FEATURES = [
  { key: 'contracts', icon: <FilePen /> },
  { key: 'workbook', icon: <FileText /> },
  { key: 'certificate', icon: <QrCode /> },
  { key: 'personalFile', icon: <UserCheck /> },
] as const;

const COMPANY_FEATURES = [
  { key: 'registration', icon: <FilePen /> },
  { key: 'corrections', icon: <RefreshCw /> },
  { key: 'remoteSigning', icon: <QrCode /> },
  { key: 'staffing', icon: <Network /> },
  { key: 'payments', icon: <Calculator /> },
] as const;

const ECOSYSTEM_ITEMS = [
  { key: 'login', icon: <LogIn /> },
  { key: 'sync', icon: <RefreshCw /> },
  { key: 'individuals', icon: <UserCheck /> },
] as const;

type FeatureCarouselProps = Readonly<{
  title: string;
  description: string;
  previousLabel: string;
  nextLabel: string;
  features: readonly { key: string; icon: ReactNode; title: string; description: string }[];
  className?: string;
}>;

function FeatureCarousel({ features, ...section }: FeatureCarouselProps) {
  return (
    <CarouselSection
      {...section}
      mobileLayout="scroll"
      itemClassName="w-70 lg:w-97"
      items={features.map(({ key, icon, title, description }) => ({
        key,
        node: (
          <FeatureCard className="w-full" layout="responsive" icon={icon} title={title} description={description} />
        ),
      }))}
    />
  );
}

export async function AboutPage() {
  const t = await getTranslations('AboutPage');
  const locale = await getLocale();
  const [stats, inspections] = await Promise.all([getPortalStats(locale), getLabourInspections(locale)]);
  const carouselLabels = { previousLabel: t('carousel.previous'), nextLabel: t('carousel.next') };

  return (
    <main id={MAIN_CONTENT_ID} className="pt-6 pb-10 lg:pt-14 lg:pb-14">
      <div className="page-container flex flex-col gap-8 lg:gap-18">
        <PageHero
          title={t('hero.title')}
          accent={t('hero.accent')}
          description={t('hero.description')}
          primaryAction={{ label: t('hero.primary'), href: ROUTES.login }}
          secondaryAction={{ label: t('hero.secondary'), href: ROUTES.selfCheck }}
          photo={{ desktop: heroDesktop, mobile: heroMobile }}
          photoCard={{
            icon: <Database />,
            title: t('hero.photoTitle'),
            description: t('hero.photoText'),
            href: ROUTES.helpServices,
          }}
          quickActionsLabel={t('hero.quickActionsLabel')}
          quickActions={QUICK_ACTIONS.map(({ key, icon, href }) => ({
            icon,
            href,
            title: t(`hero.quick.${key}.title`),
            description: t(`hero.quick.${key}.text`),
          }))}
        />
        <PortalStats stats={stats} />
      </div>

      <FeatureCarousel
        className="mt-8 lg:mt-18"
        title={t('employees.title')}
        description={t('employees.description')}
        {...carouselLabels}
        features={EMPLOYEE_FEATURES.map(({ key, icon }) => ({
          key,
          icon,
          title: t(`employees.${key}.title`),
          description: t(`employees.${key}.text`),
        }))}
      />

      <FeatureCarousel
        className="mt-8 lg:mt-17.5"
        title={t('companies.title')}
        description={t('companies.description')}
        {...carouselLabels}
        features={COMPANY_FEATURES.map(({ key, icon }) => ({
          key,
          icon,
          title: t(`companies.${key}.title`),
          description: t(`companies.${key}.text`),
        }))}
      />

      <div className="page-container mt-8 flex flex-col gap-8 lg:mt-17.5 lg:gap-18">
        <Showcase
          title={t('ecosystem.title')}
          description={t('ecosystem.description')}
          items={ECOSYSTEM_ITEMS.map(({ key, icon }) => ({ icon, text: t(`ecosystem.${key}`) }))}
          action={{ label: t('ecosystem.action'), href: EXTERNAL_LINKS.labourExchange }}
        />
        <LabourInspection inspections={inspections} />
      </div>
    </main>
  );
}
