import { RuleTester } from 'eslint';

import { noComments } from './no-comments.ts';

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } });

ruleTester.run('local/no-comments', noComments, {
  valid: [
    'const total = 1;',
    '// eslint-disable-next-line no-console -- printed to CI log on purpose\nconsole.log(1);',
    '// @ts-expect-error broken upstream typings\nconst value = 1;',
    '/// <reference types="vite/client" />\nconst value = 1;',
  ],
  invalid: [
    { code: '// explains the next line\nconst total = 1;', errors: [{ messageId: 'forbidden' }] },
    { code: '/* block */ const total = 1;', errors: [{ messageId: 'forbidden' }] },
    { code: '/** jsdoc */ function sum() {}', errors: [{ messageId: 'forbidden' }] },
    { code: '// TODO later\nconst total = 1;', errors: [{ messageId: 'forbidden' }] },
    { code: '// eslint-disable-next-line no-console\nconsole.log(1);', errors: [{ messageId: 'forbidden' }] },
    { code: '// @ts-expect-error\nconst total = 1;', errors: [{ messageId: 'forbidden' }] },
  ],
});
