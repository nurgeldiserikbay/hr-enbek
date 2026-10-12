const config = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'utility',
          'variant',
          'custom-variant',
          'source',
          'plugin',
          'apply',
          'reference',
          'config',
        ],
      },
    ],
    'import-notation': 'string',
    'comment-word-disallowed-list': [/./u],
    'declaration-no-important': null,
    'custom-property-empty-line-before': null,
    'custom-property-pattern': [
      /^[a-z][\da-z]*(?:-[\da-z]+)*(?:--[a-z]+(?:-[a-z]+)*)?(?:-\*)?$/u,
      {
        message:
          'Expected kebab-case, a Tailwind sub-property like --text-h1--line-height or a namespace reset like --color-*',
      },
    ],
  },
};

export default config;
