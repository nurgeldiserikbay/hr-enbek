'use client';

import { type ReactNode, useId, useRef, useState } from 'react';

import { cn } from '@/shared/lib/styles';
import { ChevronLeft, ChevronRight } from '@/shared/ui/icon';

import { Button } from '../button/button.tsx';
import { SectionHeader } from '../section-header/section-header.tsx';

const ITEM_GAP_PX = 24;
const MOBILE_PAGE_SIZE = 3;

interface CarouselItem {
  key: string;
  node: ReactNode;
}

type CarouselSectionProps = Readonly<{
  title: string;
  accent?: string;
  description?: string;
  actions?: ReactNode;
  previousLabel: string;
  nextLabel: string;
  items: readonly CarouselItem[];
  itemClassName?: string;
  mobileLayout?: 'stack' | 'scroll';
  titleClassName?: string;
  descriptionClassName?: string;
  listClassName?: string;
  className?: string;
}>;

export function CarouselSection({
  title,
  accent,
  description,
  actions,
  previousLabel,
  nextLabel,
  items,
  itemClassName,
  mobileLayout = 'stack',
  titleClassName,
  descriptionClassName,
  listClassName,
  className,
}: CarouselSectionProps) {
  const isScrollOnMobile = mobileLayout === 'scroll';
  const headingId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const [mobilePage, setMobilePage] = useState(0);
  const mobilePageCount = Math.ceil(items.length / MOBILE_PAGE_SIZE);

  const scrollByItem = (direction: -1 | 1) => {
    if (!isScrollOnMobile && !globalThis.matchMedia('(min-width: 1024px)').matches) {
      setMobilePage((page) => (page + direction + mobilePageCount) % mobilePageCount);
      return;
    }
    const list = listRef.current;
    const item = list?.firstElementChild;
    if (!list || !item) return;
    list.scrollBy({ left: direction * (item.clientWidth + ITEM_GAP_PX), behavior: 'smooth' });
  };

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="page-container">
        <SectionHeader
          id={headingId}
          title={title}
          {...(titleClassName === undefined ? {} : { titleClassName })}
          {...(accent === undefined ? {} : { accent })}
          {...(description === undefined ? {} : { description })}
          {...(descriptionClassName === undefined ? {} : { descriptionClassName })}
          actions={
            <>
              {actions}
              <Button
                variant="secondary"
                size="icon"
                className="shrink-0"
                aria-label={previousLabel}
                onClick={() => {
                  scrollByItem(-1);
                }}
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="shrink-0"
                aria-label={nextLabel}
                onClick={() => {
                  scrollByItem(1);
                }}
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </Button>
            </>
          }
        />
      </div>
      <ul
        ref={listRef}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a horizontally scrollable region must be focusable to scroll it from the keyboard
        tabIndex={0}
        aria-labelledby={headingId}
        className={cn(
          'mt-4 flex gap-4 px-4 lg:mt-7 lg:flex-row lg:gap-6 lg:overflow-x-auto',
          'lg:snap-x lg:snap-mandatory lg:[scrollbar-width:none]',
          isScrollOnMobile ? 'snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] overflow-x-auto' : 'flex-col',
          'lg:scroll-px-[max(1rem,calc((100vw-82.5rem)/2))] lg:px-[max(1rem,calc((100vw-82.5rem)/2))]',
          listClassName,
        )}
      >
        {items.map(({ key, node }, index) => (
          <li
            key={key}
            className={cn(
              'flex shrink-0 snap-start',
              !isScrollOnMobile && Math.floor(index / MOBILE_PAGE_SIZE) !== mobilePage && 'max-lg:hidden',
              itemClassName,
            )}
          >
            {node}
          </li>
        ))}
      </ul>
    </section>
  );
}
