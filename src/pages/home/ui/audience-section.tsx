import { useTranslations } from 'next-intl';

import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { BookOpen, Calculator, HandCoins, Network, QrCode, Smartphone } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';

const AUDIENCES = [
  {
    key: 'employer',
    href: ROUTES.employer,
    features: [
      { key: 'employer.signing', Icon: QrCode },
      { key: 'employer.staffing', Icon: Network },
      { key: 'employer.benefits', Icon: HandCoins },
    ],
  },
  {
    key: 'employee',
    href: ROUTES.employee,
    features: [
      { key: 'employee.workbook', Icon: BookOpen },
      { key: 'employee.calculator', Icon: Calculator },
      { key: 'employee.app', Icon: Smartphone },
    ],
  },
] as const;

export function AudienceSection() {
  const t = useTranslations('HomePage.audience');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {AUDIENCES.map(({ key, href, features }) => (
        <Card key={key} asChild tone="soft" className="flex flex-col p-4 lg:p-6">
          <section aria-labelledby={`audience-${key}`}>
            <h2 id={`audience-${key}`} className="text-h3 text-text-heading lg:text-h2-sm">
              {t(`${key}.title`)}
            </h2>
            <p className="mt-2 text-body-l text-text-body lg:mt-3">{t(`${key}.description`)}</p>
            <ul className="mt-4 flex flex-col gap-4 lg:mt-6 lg:gap-0">
              {features.map(({ key: featureKey, Icon }) => (
                <li
                  key={featureKey}
                  className="flex items-center gap-3 rounded-xl bg-surface-card px-4 py-2 lg:bg-transparent lg:py-4"
                >
                  <IconTile>
                    <Icon />
                  </IconTile>
                  <span>
                    <span className="block text-body-l-medium text-text-heading lg:font-medium">
                      {t(`${featureKey}.title`)}
                    </span>
                    <span className="mt-0.5 block text-body-s text-text-body lg:mt-1">
                      {t(`${featureKey}.description`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-4 h-10 text-body-l font-normal lg:mt-4.5 lg:w-69 lg:self-start">
              <Link href={href}>{t(`${key}.action`)}</Link>
            </Button>
          </section>
        </Card>
      ))}
    </div>
  );
}
