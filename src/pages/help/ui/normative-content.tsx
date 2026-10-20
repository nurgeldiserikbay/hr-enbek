import { useTranslations } from 'next-intl';

import type { LegalDocumentGroup } from '@/entities/legal-documents';
import { cmsDownloadUrl, fieldLanguage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { ContentIcon } from '@/shared/ui/content-icon';
import { Download, ExternalLink } from '@/shared/ui/icon';
import { ItemRow } from '@/shared/ui/item-row';

import { EmptyResult } from './empty-result.tsx';

type NormativeContentProps = Readonly<{
  groups: readonly LegalDocumentGroup[];
}>;

export function NormativeContent({ groups }: NormativeContentProps) {
  const t = useTranslations('HelpPage');

  if (groups.length === 0) return <EmptyResult />;

  return (
    <div className="flex flex-col gap-6 lg:gap-4.5">
      {groups.map(({ id, title, icon, lang, documents }) => (
        <section key={id} aria-labelledby={`documents-${id}`} className="flex flex-col gap-3 lg:gap-4">
          <h2 id={`documents-${id}`} lang={lang} className="text-h5 text-text-heading lg:text-h3">
            {title}
          </h2>
          {documents.map((document) => (
            <ItemRow
              key={document.id}
              icon={<ContentIcon name={icon} />}
              title={<span lang={document.language.lang}>{document.title}</span>}
              {...(document.description === undefined
                ? {}
                : {
                    description: (
                      <span lang={fieldLanguage(document.language, 'description')}>{document.description}</span>
                    ),
                  })}
              actions={
                <>
                  {document.openUrl !== undefined && (
                    <a
                      href={document.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 px-2 text-body-s-medium text-brand-primary"
                    >
                      {t('open')}
                      <span className="sr-only">
                        : {document.title} {t('newTab')}
                      </span>
                      <ExternalLink aria-hidden="true" className="size-4" />
                    </a>
                  )}
                  {document.pdfUrl !== undefined && (
                    <Button asChild variant="secondary" size="sm" className="h-9 font-normal">
                      <a href={cmsDownloadUrl(document.pdfUrl)} download>
                        <Download aria-hidden="true" className="size-4" />
                        {t('pdf')}
                        <span className="sr-only">: {document.title}</span>
                      </a>
                    </Button>
                  )}
                </>
              }
            />
          ))}
        </section>
      ))}
    </div>
  );
}
