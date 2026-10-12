export interface NewsFeedFilters {
  query: string | undefined;
  category: string | undefined;
  page: number;
}

export function newsFeedHref(pathname: string, { query, category, page }: NewsFeedFilters): string {
  const params = new URLSearchParams();
  if (query !== undefined) params.set('q', query);
  if (category !== undefined) params.set('category', category);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search === '' ? pathname : `${pathname}?${search}`;
}

export function parseNewsPage(value?: string | string[]): number {
  const page = typeof value === 'string' ? Number(value) : Number.NaN;
  return Number.isInteger(page) && page > 0 ? page : 1;
}
