import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { getLabourInspections } from '@/entities/labour-inspections';
import { type Audience, MAIN_CONTENT_ID, ROUTES } from '@/shared/config';
import { cn } from '@/shared/lib/styles';
import { FeatureCard } from '@/shared/ui/feature-card';
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Briefcase,
  FileCheck,
  FilePen,
  Files,
  FileText,
  FolderOpen,
  HeartPulse,
  IdCard,
  Network,
  QrCode,
  Signature,
  Smartphone,
  UserCheck,
} from '@/shared/ui/icon';
import { ResponsiveImage, type ResponsiveImageSources } from '@/shared/ui/responsive-image';
import { SectionHeader } from '@/shared/ui/section-header';
import { Tag } from '@/shared/ui/tag';
import { LabourInspection } from '@/widgets/labour-inspection';
import { PageHero } from '@/widgets/page-hero';
import { Showcase } from '@/widgets/showcase';

import employeeHeroDesktop from './employee-hero-desktop.jpg';
import employeeHeroMobile from './employee-hero-mobile.jpg';
import employeeShowcaseDesktop from './employee-showcase-desktop.png';
import employeeShowcaseMobile from './employee-showcase-mobile.png';
import employerHeroDesktop from './employer-hero-desktop.jpg';
import employerHeroMobile from './employer-hero-mobile.jpg';
import employerShowcaseDesktop from './employer-showcase-desktop.png';
import employerShowcaseMobile from './employer-showcase-mobile.png';

interface AudienceContent {
  hero: ResponsiveImageSources;
  showcase: ResponsiveImageSources;
  primaryHref: string;
  secondaryHref: string;
  photoCard: { icon: ReactNode; href: string };
  quickActions: readonly { key: 'first' | 'second'; icon: ReactNode; href: string }[];
  features: readonly { key: 'first' | 'second' | 'third'; icon: ReactNode; isComingSoon?: boolean }[];
  showcaseItems: readonly { key: 'first' | 'second' | 'third'; icon: ReactNode }[];
  hasShowcaseAction: boolean;
}

const CONTENT: Record<Audience, AudienceContent> = {
  employer: {
    hero: { desktop: employerHeroDesktop, mobile: employerHeroMobile },
    showcase: { desktop: employerShowcaseDesktop, mobile: employerShowcaseMobile },
    primaryHref: ROUTES.login,
    secondaryHref: ROUTES.selfCheck,
    photoCard: { icon: <FilePen />, href: ROUTES.helpInstructions },
    quickActions: [
      { key: 'first', icon: <IdCard />, href: ROUTES.login },
      { key: 'second', icon: <FolderOpen />, href: ROUTES.staffing },
    ],
    features: [
      { key: 'first', icon: <Files /> },
      { key: 'second', icon: <FileCheck /> },
      { key: 'third', icon: <Network /> },
    ],
    showcaseItems: [
      { key: 'first', icon: <QrCode /> },
      { key: 'second', icon: <UserCheck /> },
      { key: 'third', icon: <Smartphone /> },
    ],
    hasShowcaseAction: true,
  },
  employee: {
    hero: { desktop: employeeHeroDesktop, mobile: employeeHeroMobile },
    showcase: { desktop: employeeShowcaseDesktop, mobile: employeeShowcaseMobile },
    primaryHref: ROUTES.login,
    secondaryHref: ROUTES.mobileApp,
    photoCard: { icon: <BookOpen />, href: ROUTES.login },
    quickActions: [
      { key: 'first', icon: <Bell />, href: ROUTES.login },
      { key: 'second', icon: <FileText />, href: ROUTES.contracts },
    ],
    features: [
      { key: 'first', icon: <BadgeCheck /> },
      { key: 'second', icon: <Signature /> },
      { key: 'third', icon: <FolderOpen />, isComingSoon: true },
    ],
    showcaseItems: [
      { key: 'first', icon: <FileText /> },
      { key: 'second', icon: <Briefcase /> },
      { key: 'third', icon: <HeartPulse /> },
    ],
    hasShowcaseAction: false,
  },
};

type AudiencePageProps = Readonly<{
  audience: Audience;
}>;

export async function AudiencePage({ audience }: AudiencePageProps) {
  const t = await getTranslations(`AudiencePage.${audience}`);
  const tCommon = await getTranslations('AudiencePage');
  const inspections = await getLabourInspections(await getLocale());
  const content = CONTENT[audience];
  const showcaseAction = content.hasShowcaseAction
    ? { action: { label: tCommon('employer.showcase.action'), href: ROUTES.helpInstructions } }
    : {};
  const featuresAccent = audience === 'employer' ? { accentClassName: 'lg:text-text-heading' } : {};

  return (
    <main
      id={MAIN_CONTENT_ID}
      className={cn(
        'page-container flex flex-col gap-8 pt-6 pb-10 lg:gap-18 lg:pt-14',
        audience === 'employer' ? 'lg:pb-16' : 'lg:pb-20',
      )}
    >
      <PageHero
        title={t('hero.title')}
        accent={t('hero.accent')}
        description={t('hero.description')}
        primaryAction={{ label: t('hero.primary'), href: content.primaryHref }}
        secondaryAction={{ label: t('hero.secondary'), href: content.secondaryHref }}
        photo={content.hero}
        photoCard={{ ...content.photoCard, title: t('hero.photoTitle'), description: t('hero.photoText') }}
        quickActionsLabel={tCommon('quickActionsLabel')}
        quickActions={content.quickActions.map(({ key, icon, href }) => ({
          icon,
          href,
          title: t(`hero.quick.${key}.title`),
          description: t(`hero.quick.${key}.text`),
        }))}
      />

      <section aria-labelledby={`${audience}-features`} className="lg:mt-3">
        <SectionHeader
          id={`${audience}-features`}
          title={t('features.title')}
          accent={t('features.accent')}
          {...featuresAccent}
          description={t('features.description')}
          descriptionClassName="lg:mt-3"
        />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-3 lg:gap-6">
          {content.features.map(({ key, icon, isComingSoon = false }) => (
            <FeatureCard
              key={key}
              layout="responsive"
              icon={icon}
              title={t(`features.${key}.title`)}
              description={t(`features.${key}.text`)}
              badge={
                isComingSoon ? (
                  <Tag tone="success" size="sm">
                    {tCommon('comingSoon')}
                  </Tag>
                ) : undefined
              }
            />
          ))}
        </div>
      </section>

      <Showcase
        title={t('showcase.title')}
        description={t('showcase.description')}
        items={content.showcaseItems.map(({ key, icon }) => ({ icon, text: t(`showcase.${key}`) }))}
        {...showcaseAction}
        visual={
          <ResponsiveImage
            sources={content.showcase}
            alt={t('showcase.visualAlt')}
            desktopSizes="648px"
            className="size-full object-cover"
          />
        }
      />

      <LabourInspection inspections={inspections} />
    </main>
  );
}
