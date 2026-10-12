import type { ESLint } from 'eslint';

import { noComments } from './no-comments.ts';

export const localPlugin: ESLint.Plugin = {
  meta: { name: 'local' },
  rules: {
    'no-comments': noComments,
  },
};
