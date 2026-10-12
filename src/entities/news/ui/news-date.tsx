import { useFormatter } from 'next-intl';

type NewsDateProps = Readonly<{
  value: string;
}>;

export function NewsDate({ value }: NewsDateProps) {
  const format = useFormatter();
  const date = new Date(value);

  return (
    <time dateTime={value}>
      {format.dateTime(date, { day: 'numeric', month: 'long', timeZone: 'UTC' })} {date.getUTCFullYear()}
    </time>
  );
}
