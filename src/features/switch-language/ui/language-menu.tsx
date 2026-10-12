'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { VariantProps } from 'tailwind-variants';

import { Link, routing, usePathname } from '@/shared/config';
import { tv } from '@/shared/lib/styles';
import { Dropdown } from '@/shared/ui/dropdown';
import { ChevronDownSmall, Globe, GlobeSmall } from '@/shared/ui/icon';

const languageMenuVariants = tv({
  slots: {
    trigger: 'gap-1.5 text-body-s',
    icon: 'size-3.5',
    chevron: 'hidden',
    label: '',
    panel: 'rounded-xl p-4',
    item: 'flex items-center rounded-[14px] px-3.5 py-3 text-body-m-medium text-text-heading hover:bg-brand-tint hover:font-semibold hover:text-brand-primary aria-[current=true]:bg-brand-tint aria-[current=true]:font-semibold aria-[current=true]:text-brand-primary',
  },
  variants: {
    tone: {
      default: {
        trigger: 'px-3 py-2.5 text-text-body hover:text-text-heading',
        panel: 'mt-[9px]',
      },
      inverse: {
        trigger:
          'text-label font-normal text-text-placeholder hover:text-text-inverse lg:text-caption [&>svg]:order-last',
      },
      bordered: {
        trigger:
          'h-8 shrink-0 rounded-lg border border-border-strong bg-surface-card px-2.5 text-caption whitespace-nowrap text-text-heading hover:bg-surface-soft [[open]>&>svg:last-child]:rotate-180',
        icon: 'size-4',
        chevron: 'ml-0.5 block size-3.5 transition-transform',
        label: '[width:calc-size(max-content,round(up,size,1px))]',
        panel: 'mt-2',
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

type LanguageMenuProps = Readonly<VariantProps<typeof languageMenuVariants>>;

export function LanguageMenu({ tone }: LanguageMenuProps) {
  const t = useTranslations('LanguageMenu');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const styles = languageMenuVariants({ tone });
  const GlobeIcon = tone === 'bordered' ? GlobeSmall : Globe;

  return (
    <Dropdown
      align="end"
      side={tone === 'inverse' ? 'top' : 'bottom'}
      triggerClassName={styles.trigger()}
      panelClassName={styles.panel()}
      trigger={
        <>
          <GlobeIcon aria-hidden="true" className={styles.icon()} />
          <span className="sr-only">{t('label')}: </span>
          <span className={styles.label()}>{t(currentLocale)}</span>
          <ChevronDownSmall aria-hidden="true" className={styles.chevron()} />
        </>
      }
    >
      <ul className="flex flex-col gap-1">
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              lang={locale}
              aria-current={locale === currentLocale ? 'true' : undefined}
              className={styles.item()}
            >
              {t(locale)}
            </Link>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
