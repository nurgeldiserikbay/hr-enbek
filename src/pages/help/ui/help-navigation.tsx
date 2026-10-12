import { useTranslations } from 'next-intl';

import { Card } from '@/shared/ui/card';
import { CircleHelp, FileText, Gavel, Handshake, type IconComponent, Layers, Video } from '@/shared/ui/icon';
import { NavLink } from '@/shared/ui/nav-link';

import { HELP_SECTIONS, type HelpSection, helpSectionRoute } from '../config/sections.ts';

const ICONS: Record<HelpSection, IconComponent> = {
  faq: CircleHelp,
  normative: Gavel,
  instructions: FileText,
  videos: Video,
  services: Layers,
  agreements: Handshake,
};

export function HelpNavigation() {
  const t = useTranslations('HelpPage');

  return (
    <Card asChild className="self-start p-3">
      <nav aria-labelledby="help-navigation">
        <h2 id="help-navigation" className="pt-1 pb-3 text-body-s text-text-muted">
          {t('navigation')}
        </h2>
        <ul className="flex flex-col gap-1">
          {HELP_SECTIONS.map((section) => {
            const Icon = ICONS[section];
            return (
              <li key={section}>
                <NavLink
                  href={helpSectionRoute(section)}
                  className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-body-m-medium text-text-heading hover:bg-surface-soft aria-[current=page]:bg-brand-tint aria-[current=page]:text-brand-primary"
                >
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  {t(`sections.${section}.title`)}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </Card>
  );
}
