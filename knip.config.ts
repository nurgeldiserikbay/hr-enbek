import type { KnipConfig } from 'knip';

const CSS_IMPORT = /@import\s+(['"][^'"]+['"])/gu;

const config: KnipConfig = {
  entry: [
    'src/shared/config/i18n/request.ts',
    'src/shared/ui/*/index.ts',
    'tooling/scripts/*.ts',
    'steiger.config.mjs',
  ],
  project: ['**/*.{ts,tsx,mts,mjs,css}'],
  compilers: {
    css: (text: string) =>
      [...text.matchAll(CSS_IMPORT)].map(([, specifier = '']) => `import ${specifier};`).join('\n'),
  },
};

export default config;
