import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/config';
import { BookOpen, ClipboardCheck, FilePen, Smartphone } from '@/shared/ui/icon';
import { PageHero } from '@/widgets/page-hero';

import heroDesktop from './hero-desktop.jpg';
import heroMobile from './hero-mobile.jpg';

const REGISTER_CARD_DESIGN_TOP_OFFSET = 'lg:justify-start lg:pt-[8.67px]';

const QUICK_ACTIONS = [
  { key: 'register', href: ROUTES.login, icon: <FilePen />, className: REGISTER_CARD_DESIGN_TOP_OFFSET },
  { key: 'help', href: ROUTES.help, icon: <BookOpen /> },
  { key: 'app', href: ROUTES.mobileApp, icon: <Smartphone /> },
] as const;

export function HeroSection() {
  const t = useTranslations('HomePage.hero');
  const tActions = useTranslations('HomePage.quickActions');

  return (
    <PageHero
      title={t('titleStart')}
      accent={t('titleAccent')}
      description={t('description')}
      primaryAction={{ label: t('selfCheck'), href: ROUTES.selfCheck }}
      secondaryAction={{ label: t('login'), href: ROUTES.login }}
      photo={{ desktop: heroDesktop, mobile: heroMobile }}
      photoCard={{
        icon: <ClipboardCheck />,
        title: t('selfCheckCardTitle'),
        description: t('selfCheckCardText'),
        href: ROUTES.selfCheck,
      }}
      quickActionsLabel={tActions('label')}
      quickActions={QUICK_ACTIONS.map((action) => ({
        icon: action.icon,
        href: action.href,
        className: 'className' in action ? action.className : undefined,
        title: tActions(`${action.key}.title`),
        description: tActions(`${action.key}.description`),
      }))}
    />
  );
}
