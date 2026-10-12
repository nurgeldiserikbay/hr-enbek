import { getPageItems, type PageItem } from './get-page-items.ts';

const render = (items: readonly PageItem[]) =>
  items.map((item) => (item.type === 'page' ? String(item.page) : '…')).join(' ');

describe('getPageItems', () => {
  it('shows every page when there are few of them', () => {
    expect(render(getPageItems(1, 1))).toBe('1');
    expect(render(getPageItems(4, 7))).toBe('1 2 3 4 5 6 7');
  });

  it('shows the first pages and the last one on the first page', () => {
    expect(render(getPageItems(1, 8))).toBe('1 2 3 … 8');
  });

  it('shows neighbors of the current page in the middle', () => {
    expect(render(getPageItems(5, 12))).toBe('1 … 4 5 6 … 12');
  });

  it('fills a single skipped page instead of a gap', () => {
    expect(render(getPageItems(4, 12))).toBe('1 2 3 4 5 … 12');
  });

  it('shows the last pages on the last page', () => {
    expect(render(getPageItems(8, 8))).toBe('1 … 6 7 8');
  });
});
