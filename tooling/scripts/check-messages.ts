import { readFileSync } from 'node:fs';

interface MessageTree {
  [key: string]: MessageTree | string;
}

const REQUIRED_LOCALES = ['kk', 'ru'] as const;
const OPTIONAL_LOCALE = 'en';

const readMessages = (locale: string): MessageTree =>
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- locale comes from the fixed list above
  JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8')) as MessageTree;

const flatten = (tree: MessageTree, prefix = ''): Map<string, string> =>
  new Map(
    Object.entries(tree).flatMap(([key, value]) =>
      typeof value === 'string' ? [[`${prefix}${key}`, value] as const] : [...flatten(value, `${prefix}${key}.`)],
    ),
  );

const [primary, secondary] = REQUIRED_LOCALES.map((locale) => flatten(readMessages(locale)));
const optional = flatten(readMessages(OPTIONAL_LOCALE));

const problems: string[] = [];
const report = (message: string) => problems.push(message);

if (primary && secondary) {
  for (const key of primary.keys()) {
    if (!secondary.has(key)) report(`FR-SYS-02: key "${key}" is missing in ru`);
  }
  for (const key of secondary.keys()) {
    if (!primary.has(key)) report(`FR-SYS-02: key "${key}" is missing in kk`);
  }
  for (const key of optional.keys()) {
    if (!primary.has(key)) report(`key "${key}" exists in en but not in kk`);
  }
}

for (const [locale, messages] of [
  ['kk', primary],
  ['ru', secondary],
  ['en', optional],
] as const) {
  for (const [key, value] of messages ?? []) {
    if (value.trim() === '') report(`empty value for "${key}" in ${locale}`);
  }
}

if (problems.length > 0) {
  for (const problem of problems) console.error(problem);
  process.exitCode = 1;
} else {
  console.log('Messages OK: kk and ru are complete, en is a subset of kk');
}
