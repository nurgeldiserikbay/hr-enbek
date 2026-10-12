import { extendTailwindMerge } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

export const TEXT_STYLES = [
  'display',
  'h1',
  'h1-sm',
  'h2',
  'h2-sm',
  'h2-xs',
  'h3',
  'h3-sm',
  'h4',
  'h5',
  'body-l',
  'body-l-medium',
  'body-m',
  'body-m-medium',
  'body-m-semibold',
  'body-s',
  'body-s-medium',
  'caption',
  'label',
  'overline',
  'number-2xl',
  'number-xl',
  'number-l',
];

const twMergeConfig = { extend: { theme: { text: TEXT_STYLES, radius: ['tile'] } } };

export const cn = extendTailwindMerge(twMergeConfig);

export const tv = createTV({ twMergeConfig });
