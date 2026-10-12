import { Link } from '@/shared/config';
import { cn } from '@/shared/lib/styles';
import { ChevronRight } from '@/shared/ui/icon';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

type BreadcrumbsProps = Readonly<{
  label: string;
  items: readonly BreadcrumbItem[];
  className?: string;
}>;

export function Breadcrumbs({ label, items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex min-w-0 items-center gap-2 text-body-s">
        {items.map(({ label: itemLabel, href }, index) => (
          <li key={href ?? itemLabel} className={cn('flex items-center gap-2', href === undefined && 'min-w-0')}>
            {index > 0 && <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />}
            {href === undefined ? (
              <span aria-current="page" className="max-w-87.5 truncate font-medium text-text-heading">
                {itemLabel}
              </span>
            ) : (
              <Link href={href} className="text-text-body transition-colors hover:text-text-heading">
                {itemLabel}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
