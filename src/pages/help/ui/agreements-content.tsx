import { useTranslations } from 'next-intl';

import type { Agreements } from '@/entities/agreements';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Download, Landmark, MapPin } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';
import { ItemRow } from '@/shared/ui/item-row';

import { EmptyResult } from './empty-result.tsx';

const FILE_LANGUAGES = ['kk', 'ru'] as const;

type FileButtonsProps = Readonly<{
  files: Agreements['general']['files'];
  title: string;
  variant: 'secondary' | 'overlay';
}>;

function FileButtons({ files, title, variant }: FileButtonsProps) {
  const t = useTranslations('HelpPage.agreements');

  return (
    <>
      {FILE_LANGUAGES.map((language) => (
        <Button key={language} asChild variant={variant} size="sm" className="h-9 px-3 font-normal">
          <a href={files[language]} download aria-label={t('downloadLabel', { title, language: t(language) })}>
            <Download aria-hidden="true" className="size-3.5" />
            {t(language)}
          </a>
        </Button>
      ))}
    </>
  );
}

type AgreementsContentProps = Readonly<{
  agreements: Agreements;
}>;

export function AgreementsContent({ agreements }: AgreementsContentProps) {
  const t = useTranslations('HelpPage.agreements');
  const { general, regional } = agreements;

  return (
    <div className="flex flex-col gap-6 lg:gap-5">
      <Card tone="dark" className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-5 lg:px-7 lg:py-[31px]">
        <IconTile size="card" className="bg-brand-primary text-text-inverse">
          <Landmark />
        </IconTile>
        <div className="flex-1">
          <h2 className="text-h5 lg:text-h4 lg:font-medium">{general.title}</h2>
          <p className="mt-1 text-body-s text-text-muted lg:text-body-m">{general.description}</p>
        </div>
        <div className="flex gap-2">
          <FileButtons files={general.files} title={general.title} variant="overlay" />
        </div>
      </Card>

      <section aria-labelledby="regional-agreements" className="flex flex-col gap-4">
        <h2 id="regional-agreements" className="text-h5 text-text-heading lg:text-h3">
          {t('regionalTitle')}
        </h2>
        {regional.length === 0 && <EmptyResult />}
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {regional.map(({ id, title, files }) => (
            <li key={id}>
              <ItemRow
                size="sm"
                className="lg:flex-row lg:items-center"
                icon={<MapPin />}
                title={title}
                description={t('regionalSubtitle')}
                actions={<FileButtons files={files} title={title} variant="secondary" />}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
