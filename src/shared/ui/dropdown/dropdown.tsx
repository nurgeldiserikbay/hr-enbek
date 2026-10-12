'use client';

import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const dropdownVariants = tv({
  slots: {
    trigger: 'flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden',
    panel: 'absolute z-20 min-w-40 rounded-xl bg-surface-card p-2 text-text-heading shadow-floating',
  },
  variants: {
    align: {
      start: { panel: 'left-0' },
      end: { panel: 'right-0' },
    },
    side: {
      bottom: { panel: 'top-full mt-2' },
      top: { panel: 'bottom-full mb-2' },
    },
  },
  defaultVariants: {
    align: 'start',
    side: 'bottom',
  },
});

type DropdownProps = VariantProps<typeof dropdownVariants> &
  Readonly<{
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
    triggerClassName?: string;
    panelClassName?: string;
  }>;

export function Dropdown({
  trigger,
  children,
  align,
  side,
  className,
  triggerClassName,
  panelClassName,
}: DropdownProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const styles = dropdownVariants({ align, side });

  useEffect(() => {
    const close = (event: Event) => {
      const details = detailsRef.current;
      if (details?.open !== true) return;

      if (event instanceof KeyboardEvent) {
        if (event.key !== 'Escape') return;
        details.open = false;
        details.querySelector('summary')?.focus();
        return;
      }

      if (event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    };

    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  const closeAfterNavigation = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('a') && detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className={`relative ${className ?? ''}`}>
      <summary className={styles.trigger({ className: triggerClassName })}>{trigger}</summary>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- closes the panel after a link inside it is activated; links handle their own keyboard events */}
      <div className={styles.panel({ className: panelClassName })} onClick={closeAfterNavigation}>
        {children}
      </div>
    </details>
  );
}
