import { type ReactNode, useId } from 'react';

import { Link } from '@/shared/config';
import { cn } from '@/shared/lib/styles';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { IconTile } from '@/shared/ui/icon-tile';

interface ShowcaseItem {
  icon: ReactNode;
  text: string;
}

type ShowcaseProps = Readonly<{
  title: string;
  description: string;
  items: readonly ShowcaseItem[];
  action?: { label: string; href: string };
  visual?: ReactNode;
}>;

export function Showcase({ title, description, items, action, visual }: ShowcaseProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn('grid grid-cols-1 gap-6', visual !== undefined && 'lg:grid-cols-2')}
    >
      <Card className="flex flex-col p-4 lg:px-6 lg:pt-8 lg:pb-7.5">
        <h2 id={headingId} className="text-h2-xs text-text-heading lg:text-h1-sm">
          {title}
        </h2>
        <p
          className={cn(
            'mt-3 text-body-l text-text-body lg:mt-4',
            visual === undefined ? 'lg:text-body-m' : 'lg:text-body-l',
          )}
        >
          {description}
        </p>
        <ul className="mt-6 flex flex-col gap-6 lg:mt-8 lg:gap-4">
          {items.map(({ icon, text }) => (
            <li
              key={text}
              className={cn(
                'flex items-center gap-3 rounded-xl lg:bg-surface-soft',
                'lg:min-h-[68px] lg:gap-4 lg:px-4 lg:py-2.5',
              )}
            >
              <IconTile size="card">{icon}</IconTile>
              <span className="text-body-l-medium text-text-heading">{text}</span>
            </li>
          ))}
        </ul>
        {action !== undefined && (
          <Button asChild className="mt-6 h-10 text-body-l font-normal lg:w-69 lg:self-start">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </Card>
      {visual !== undefined && <div className="overflow-hidden rounded-2xl">{visual}</div>}
    </section>
  );
}
