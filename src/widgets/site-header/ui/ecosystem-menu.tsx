import { useTranslations } from 'next-intl';

import { ECOSYSTEM_LINK_KEYS, EXTERNAL_LINKS } from '@/shared/config';
import { Dropdown } from '@/shared/ui/dropdown';
import { LayoutGrid } from '@/shared/ui/icon';

import { MENU_LINK } from './menu-link.ts';

type EcosystemMenuProps = Readonly<{
  className?: string;
}>;

export function EcosystemMenu({ className }: EcosystemMenuProps) {
  const t = useTranslations('Navigation');
  const tEcosystem = useTranslations('Ecosystem');

  return (
    <Dropdown
      {...(className === undefined ? {} : { className })}
      triggerClassName="size-9 justify-center rounded-md p-2 bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover"
      panelClassName="w-72"
      trigger={
        <>
          <LayoutGrid aria-hidden="true" className="size-4" />
          <span className="sr-only">{t('ecosystem')}</span>
        </>
      }
    >
      <ul>
        {ECOSYSTEM_LINK_KEYS.map((key) => (
          <li key={key}>
            <a href={EXTERNAL_LINKS[key]} className={MENU_LINK}>
              {tEcosystem(key)}
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
