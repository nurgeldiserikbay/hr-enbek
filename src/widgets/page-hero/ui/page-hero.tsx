import type { ReactNode } from 'react';

import { Link } from '@/shared/config';
import { cn } from '@/shared/lib/styles';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ArrowUpRight } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';
import { ResponsiveImage, type ResponsiveImageSources } from '@/shared/ui/responsive-image';

interface HeroLink {
  label: string;
  href: string;
}

interface HeroCard {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string | undefined;
}

type PageHeroProps = Readonly<{
  title: string;
  accent: string;
  description: string;
  primaryAction: HeroLink;
  secondaryAction: HeroLink;
  photo: ResponsiveImageSources;
  photoCard: HeroCard;
  quickActionsLabel: string;
  quickActions: readonly HeroCard[];
}>;

export function PageHero({
  title,
  accent,
  description,
  primaryAction,
  secondaryAction,
  photo,
  photoCard,
  quickActionsLabel,
  quickActions,
}: PageHeroProps) {
  const isPair = quickActions.length === 2;

  return (
    <section className="grid grid-cols-1 gap-6 lg:h-140 lg:grid-cols-[450fr_538fr_268fr] lg:grid-rows-[minmax(0,1fr)] lg:gap-8">
      <Card className="flex flex-col p-4 lg:bg-surface-soft lg:p-6">
        <h1 className="text-h2-xs text-text-heading lg:text-h1-sm">
          {title} <span className="text-brand-primary">{accent}</span>
        </h1>
        <p className="mt-6 text-body-l text-text-body lg:mt-8">{description}</p>
        <div className="mt-6 flex flex-col gap-3 lg:mt-auto">
          <Button asChild className="h-auto min-h-10 py-1.5 text-body-l font-normal whitespace-normal">
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="h-auto min-h-10 py-1.5 text-body-l font-normal whitespace-normal"
          >
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        </div>
      </Card>

      <div className="relative h-70 overflow-hidden rounded-2xl lg:h-auto">
        <ResponsiveImage sources={photo} alt="" priority desktopSizes="538px" className="size-full object-cover" />
        <Card
          asChild
          radius="md"
          className="absolute inset-x-2 bottom-2 flex items-center gap-3 p-4 lg:inset-x-4 lg:bottom-4 lg:px-6 lg:py-4"
        >
          <Link href={photoCard.href}>
            <IconTile>{photoCard.icon}</IconTile>
            <span>
              <span className="block text-body-s-medium text-text-heading lg:text-h5 lg:font-medium">
                {photoCard.title}
              </span>
              <span className="mt-1 block text-label font-normal text-text-body lg:mt-2 lg:text-body-l">
                {photoCard.description}
              </span>
            </span>
          </Link>
        </Card>
      </div>

      <nav aria-label={quickActionsLabel}>
        <ul className={cn('flex h-full flex-col gap-4 lg:grid lg:gap-8', isPair ? 'lg:grid-rows-2' : 'lg:grid-rows-3')}>
          {quickActions.map(({ icon, title: actionTitle, description: actionDescription, href, className }) => (
            <li key={href}>
              <Card
                asChild
                tone="soft"
                className={cn(
                  'relative flex h-full flex-col overflow-hidden p-4 lg:p-6',
                  isPair ? 'lg:justify-between lg:pr-4' : 'lg:justify-end',
                  className,
                )}
              >
                <Link href={href}>
                  <IconTile>{icon}</IconTile>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="absolute top-6 right-4 size-5 text-brand-primary lg:right-6"
                  />
                  <span className="flex flex-col">
                    <span
                      className={cn(
                        'mt-2 text-h5 leading-7 text-text-heading lg:mt-1.5',
                        isPair && 'lg:text-h4 lg:leading-6',
                      )}
                    >
                      {actionTitle}
                    </span>
                    <span className={cn('mt-2 text-body-l text-text-body', isPair ? 'lg:mt-3' : 'lg:mt-1')}>
                      {actionDescription}
                    </span>
                  </span>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
