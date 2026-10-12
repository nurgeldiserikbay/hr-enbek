import { cn } from '@/shared/lib/styles';
import { Search } from '@/shared/ui/icon';

type SearchFieldProps = Readonly<{
  label: string;
  placeholder: string;
  defaultValue?: string;
  name?: string;
  className?: string;
}>;

export function SearchField({ label, placeholder, defaultValue, name = 'q', className }: SearchFieldProps) {
  return (
    <form role="search" className={className}>
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-muted lg:left-5 lg:size-4.5"
        />
        <input
          type="search"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn(
            'h-13 w-full rounded-xl border border-border-default bg-surface-soft pr-4 pl-11 text-body-m text-text-heading lg:h-14 lg:pl-13',
            'placeholder:text-text-muted',
          )}
        />
      </label>
    </form>
  );
}
