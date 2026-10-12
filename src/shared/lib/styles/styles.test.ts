import { readFileSync } from 'node:fs';
import path from 'node:path';

import { cn, TEXT_STYLES, tv } from './styles.ts';

const globalsCss = readFileSync(path.join(import.meta.dirname, '../../../app/styles/globals.css'), 'utf8');

describe('styles', () => {
  it('knows every text style defined in globals.css', () => {
    const defined = [...globalsCss.matchAll(/--text-([\w-]+): /gu)]
      .map(([, name = '']) => name)
      .filter((name) => !name.includes('--'));

    expect(TEXT_STYLES).toEqual(defined);
  });

  it('keeps a text color next to a text style', () => {
    expect(cn('text-brand-on-primary', 'text-body-l')).toBe('text-brand-on-primary text-body-l');
  });

  it('lets a later text style override an earlier one', () => {
    expect(tv({ base: 'text-body-m text-text-heading' })({ className: 'text-h5' })).toBe('text-text-heading text-h5');
  });
});
