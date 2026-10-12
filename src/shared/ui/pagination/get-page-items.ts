export type PageItem = { type: 'page'; page: number } | { type: 'gap'; after: number };

const MAX_PAGES_WITHOUT_GAPS = 7;

export function getPageItems(currentPage: number, pageCount: number): PageItem[] {
  const shown = new Set<number>([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage === 1) shown.add(3);
  if (currentPage === pageCount) shown.add(pageCount - 2);

  const pages =
    pageCount <= MAX_PAGES_WITHOUT_GAPS
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : [...shown].filter((page) => page >= 1 && page <= pageCount).toSorted((left, right) => left - right);

  return pages.flatMap((page, index): PageItem[] => {
    const previous = pages[index - 1];
    if (previous === undefined || page - previous === 1) return [{ type: 'page', page }];
    if (page - previous === 2)
      return [
        { type: 'page', page: page - 1 },
        { type: 'page', page },
      ];
    return [
      { type: 'gap', after: previous },
      { type: 'page', page },
    ];
  });
}
