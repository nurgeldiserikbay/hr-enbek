'use client';

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';

import type { LabourInspection as LabourInspectionData } from '@/entities/labour-inspections';
import { Card } from '@/shared/ui/card';
import { PhoneSmall } from '@/shared/ui/icon';
import { Select } from '@/shared/ui/select';

type LabourInspectionProps = Readonly<{
  inspections: readonly LabourInspectionData[];
}>;

const LABEL = 'text-body-m-medium text-text-heading';
const VALUE = 'text-body-m text-text-body';

export function LabourInspection({ inspections }: LabourInspectionProps) {
  const t = useTranslations('LabourInspection');
  const headingId = useId();
  const [regionId, setRegionId] = useState<string>();
  const selected = inspections.find((inspection) => inspection.regionId === regionId);
  const department = selected?.department;

  return (
    <Card asChild className="px-4 pt-4 pb-4 lg:px-7 lg:py-7.5 lg:pt-6.5">
      <section aria-labelledby={headingId}>
        <div className="flex flex-col gap-3 py-0.5 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          <h2 id={headingId} className="text-h4 text-text-heading lg:text-h3">
            {t('title')}
          </h2>
          <Select
            aria-labelledby={headingId}
            placeholder={t('placeholder')}
            options={inspections.map(({ regionId: value, regionName: label }) => ({ value, label }))}
            {...(regionId === undefined ? {} : { value: regionId })}
            onValueChange={setRegionId}
            className="uppercase data-placeholder:normal-case lg:w-60"
            contentClassName="uppercase"
          />
        </div>

        {selected !== undefined && department === undefined && (
          <p aria-live="polite" className={`mt-5 ${VALUE}`}>
            {t('empty')}
          </p>
        )}

        {department !== undefined && (
          <div aria-live="polite" lang={department.lang} className="mt-5">
            {department.organization !== undefined && <p className={LABEL}>{department.organization}</p>}
            <div className="mt-4 grid gap-4 lg:grid-cols-[22rem_1fr] lg:gap-x-7">
              {(department.address !== undefined ||
                department.phone !== undefined ||
                department.email !== undefined) && (
                <dl>
                  <dt className={LABEL}>{t('address')}</dt>
                  {department.address !== undefined && <dd className={VALUE}>{department.address}</dd>}
                  {department.phone !== undefined && (
                    <dd className={`mt-1 ${VALUE}`}>
                      <a
                        href={`tel:${department.phone.replaceAll(/[^\d+]/gu, '')}`}
                        className="inline-flex items-center gap-2"
                      >
                        <PhoneSmall aria-hidden="true" className="size-5 shrink-0" />
                        {department.phone}
                      </a>
                    </dd>
                  )}
                  {department.email !== undefined && (
                    <dd className={`mt-1 ${VALUE}`}>
                      <a href={`mailto:${department.email}`} className="inline-flex items-center gap-2">
                        <Mail aria-hidden="true" className="size-5 shrink-0" />
                        {department.email}
                      </a>
                    </dd>
                  )}
                </dl>
              )}
              <dl>
                {department.inspectors.length > 0 && (
                  <>
                    <dt className={LABEL}>{t('inspector')}</dt>
                    {department.inspectors.map((inspector) => (
                      <dd key={inspector} className={VALUE}>
                        {inspector}
                      </dd>
                    ))}
                  </>
                )}
                {department.director !== undefined && (
                  <>
                    <dt className={LABEL}>{t('director')}</dt>
                    <dd className={VALUE}>{department.director}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        )}
      </section>
    </Card>
  );
}
