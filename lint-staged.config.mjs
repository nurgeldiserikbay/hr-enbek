const config = {
  '*.{ts,tsx,mts,mjs}': [
    'eslint --max-warnings=0 --fix',
    'prettier --write',
    'cspell --no-progress --no-must-find-files',
  ],
  '*.css': ['stylelint --max-warnings=0 --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write', 'cspell --no-progress --no-must-find-files'],
};

export default config;
