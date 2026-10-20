import { useTranslations } from 'next-intl';

import type { AgreementFiles, Agreements } from '@/entities/agreements';
import { cmsDownloadUrl, fieldLanguage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Download, Landmark, MapPin } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';
import { ItemRow } from '@/shared/ui/item-row';

import { EmptyResult } from './empty-result.tsx';

const FILE_LANGUAGES = ['kk', 'ru'] as const;

type FileButtonsProps = Readonly<{
  files: AgreementFiles;
  title: string;
  variant: 'secondary' | 'overlay';
}>;

function FileButtons({ files, title, variant }: FileButtonsProps) {
  const t = useTranslations('HelpPage.agreements');

  return (
    <>
      {FILE_LANGUAGES.map((language) => {
        const url = files[language];
        if (url === undefined) return null;
        return (
          <Button key={language} asChild variant={variant} size="sm" className="h-9 px-3 font-normal">
            <a
              href={cmsDownloadUrl(url)}
              download
              hrefLang={language}
              aria-label={t('downloadLabel', { title, language: t(language) })}
            >
              <Download aria-hidden="true" className="size-3.5" />
              {t(language)}
            </a>
          </Button>
        );
      })}
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
      {general.map(({ id, title, titleLang, description, files, language }) => (
        <Card
          key={id}
          tone="dark"
          className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-5 lg:px-7 lg:py-[31px]"
        >
          <IconTile size="card" className="bg-brand-primary text-text-inverse">
            <Landmark />
          </IconTile>
          <div className="flex-1">
            <h2 lang={titleLang} className="text-h5 lg:text-h4 lg:font-medium">
              {title}
            </h2>
            {description !== undefined && (
              <p
                lang={fieldLanguage(language, 'description')}
                className="mt-1 text-body-s text-text-muted lg:text-body-m"
              >
                {description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <FileButtons files={files} title={title} variant="overlay" />
          </div>
        </Card>
      ))}

      <section aria-labelledby="regional-agreements" className="flex flex-col gap-4">
        <h2 id="regional-agreements" className="text-h5 text-text-heading lg:text-h3">
          {t('regionalTitle')}
        </h2>
        {regional.length === 0 && <EmptyResult />}
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {regional.map(({ id, title, titleLang, files }) => (
            <li key={id}>
              <ItemRow
                size="sm"
                className="lg:flex-row lg:items-center"
                icon={<MapPin />}
                title={<span lang={titleLang}>{title}</span>}
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
