import { Link } from '@/shared/config';
import { Chip } from '@/shared/ui/chip';

interface FilterOption {
  value: string | undefined;
  label: string;
}

type FilterChipsProps = Readonly<{
  label: string;
  pathname: string;
  param: string;
  current: string | undefined;
  query: string | undefined;
  options: readonly FilterOption[];
}>;

const buildHref = (pathname: string, params: Record<string, string | undefined>) => {
  const search = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => entry[1] !== undefined && entry[1] !== ''),
  ).toString();
  return search === '' ? pathname : `${pathname}?${search}`;
};

export function FilterChips({ label, pathname, param, current, query, options }: FilterChipsProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-x-2 gap-y-3.5">
        {options.map(({ value, label: optionLabel }) => (
          <li key={value ?? 'all'}>
            <Chip asChild isActive={current === value}>
              <Link href={buildHref(pathname, { q: query, [param]: value })} scroll={false}>
                {optionLabel}
              </Link>
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  );
}
