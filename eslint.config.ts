import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintReact from '@eslint-react/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import checkFile from 'eslint-plugin-check-file';
import i18next from 'eslint-plugin-i18next';
import { importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import noSecrets from 'eslint-plugin-no-secrets';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import storybook from 'eslint-plugin-storybook';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

import { localPlugin } from './tooling/eslint-rules/index.ts';

const DEFAULT_EXPORT_ALLOWED = [
  'app/**/*.{ts,tsx}',
  'proxy.ts',
  '**/*.config.{ts,mts}',
  '.storybook/**/*.{ts,tsx}',
  '**/*.stories.tsx',
  'src/shared/config/i18n/request.ts',
  'tooling/types/**/*.d.ts',
];

const sonarRecommended = sonarjs.configs?.['recommended'] as Linter.Config;

const TS_FILES = ['**/*.{ts,tsx,mts}'];
const JS_FILES = ['**/*.{js,mjs,cjs}'];
const TEST_FILES = ['**/*.test.{ts,tsx}', '**/*.stories.tsx', 'tests/**/*.ts'];

export default defineConfig(
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'storybook-static/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    '.lighthouseci/**',
    'next-env.d.ts',
    'src/shared/api/generated/**',
  ]),

  {
    files: JS_FILES,
    extends: [js.configs.recommended],
    plugins: { local: localPlugin },
    rules: { 'local/no-comments': 'error' },
  },

  {
    files: TS_FILES,
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintReact.configs['strict-type-checked'],
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.strict,
      nextPlugin.configs['core-web-vitals'],
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      sonarRecommended,
      unicorn.configs.recommended,
      security.configs.recommended,
      comments.recommended,
      tanstackQuery.configs['flat/recommended'],
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  storybook.configs['flat/recommended'] as unknown as Linter.Config[],

  {
    files: TS_FILES,
    plugins: { 'better-tailwindcss': betterTailwind },
    rules: betterTailwind.configs['correctness-error'].rules,
    settings: {
      'better-tailwindcss': { entryPoint: 'src/app/styles/globals.css' },
    },
  },

  {
    files: TS_FILES,
    plugins: {
      i18next,
      local: localPlugin,
      'check-file': checkFile,
      'no-secrets': noSecrets,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
    },
    rules: {
      'local/no-comments': 'error',
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'jsx-attributes': {
            exclude: [
              'className',
              '.+ClassName',
              'style',
              'type',
              'key',
              'id',
              'width',
              'height',
              'sizes',
              'param',
              '.+Sizes',
            ],
          },
        },
      ],
      'no-secrets/no-secrets': ['error', { tolerance: 4.5 }],

      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-default-export': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-named-as-default-member': 'off',

      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,tsx,mts,mjs,css}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE', 'tooling/**/': 'KEBAB_CASE' }],

      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: false, requireDefaultForNonUnion: true },
      ],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        { allowString: false, allowNumber: false, allowNullableObject: true },
      ],
      '@typescript-eslint/no-shadow': 'error',

      'no-console': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'tailwind-merge', message: 'Use cn from @/shared/lib/styles: it knows the project text styles.' },
            {
              name: 'tailwind-variants',
              importNames: ['tv', 'createTV', 'cn', 'cnMerge'],
              message: 'Use tv from @/shared/lib/styles: it knows the project text styles.',
            },
          ],
        },
      ],
      eqeqeq: ['error', 'always'],
      'no-param-reassign': 'error',
      'max-lines': ['error', { max: 300, skipBlankLines: true }],
      'max-params': ['error', 3],
      'max-depth': ['error', 3],

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',

      'security/detect-object-injection': 'off',
    },
  },

  {
    files: DEFAULT_EXPORT_ALLOWED,
    rules: { 'import-x/no-default-export': 'off' },
  },

  {
    files: TEST_FILES,
    rules: {
      'i18next/no-literal-string': 'off',
      'max-lines': 'off',
    },
  },

  {
    files: ['src/shared/lib/styles/**'],
    rules: { 'no-restricted-imports': 'off' },
  },

  {
    files: ['tooling/scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },

  prettier,
);
