'use client';

import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const dialogVariants = tv({
  base: [
    'h-dvh max-h-none max-w-none overflow-hidden p-0 text-text-heading open:flex open:flex-col',
    'transition-[translate,opacity,display,overlay] transition-discrete duration-300 ease-out',
    'backdrop:bg-overlay-dark-30 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300',
    'backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
  ],
  variants: {
    layout: {
      drawer: [
        'top-0 right-0 left-auto w-full rounded-l-xl bg-surface-soft max-sm:rounded-none sm:w-[715px]',
        'translate-x-full open:translate-x-0 starting:open:translate-x-full',
      ],
      fullscreen: 'inset-0 w-full bg-surface-card opacity-0 open:opacity-100 starting:open:opacity-0',
    },
  },
  defaultVariants: {
    layout: 'drawer',
  },
});

type DialogProps = VariantProps<typeof dialogVariants> &
  Readonly<{
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    'aria-labelledby'?: string;
    'aria-label'?: string;
  }>;

export function Dialog({ isOpen, onClose, children, layout, className, ...ariaProps }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click closes the dialog; Escape is handled natively through onClose
    <dialog
      ref={dialogRef}
      className={dialogVariants({ layout, className })}
      onClose={onClose}
      onClick={closeOnBackdrop}
      {...ariaProps}
    >
      {children}
    </dialog>
  );
}
