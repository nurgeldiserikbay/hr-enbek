import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ALLOWED_LICENSES = new Set([
  '0BSD',
  'Apache-2.0',
  'BlueOak-1.0.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC-BY-4.0',
  'CC0-1.0',
  'ISC',
  'MIT',
  'OFL-1.1',
  'Unlicense',
]);

const REPORT_PATH = 'docs/third-party-licenses.md';

type LicensedPackage = Readonly<{ name: string; versions: string[]; license: string }>;

const readProductionLicenses = (): LicensedPackage[] => {
  const pnpmPath = process.env['npm_execpath'];
  if (pnpmPath === undefined) {
    throw new Error('Run this script through pnpm: pnpm licenses:check');
  }
  const output = execFileSync(pnpmPath, ['licenses', 'list', '--prod', '--json'], { encoding: 'utf8' });
  const byLicense = JSON.parse(output) as Record<string, LicensedPackage[]>;
  return Object.values(byLicense)
    .flat()
    .toSorted((left, right) => left.name.localeCompare(right.name));
};

const toMarkdown = (packages: readonly LicensedPackage[]): string => {
  const rows = packages.map(({ name, versions, license }) => `| ${name} | ${versions.join(', ')} | ${license} |`);
  return ['# Third-party components', '', '| Package | Version | License |', '| --- | --- | --- |', ...rows, ''].join(
    '\n',
  );
};

const packages = readProductionLicenses();
writeFileSync(REPORT_PATH, toMarkdown(packages));

const rejected = packages.filter(({ license }) => !ALLOWED_LICENSES.has(license));
if (rejected.length > 0) {
  for (const { name, license } of rejected) {
    console.error(`License not allowed by CR-SYS-08: ${name} (${license})`);
  }
  process.exitCode = 1;
} else {
  console.log(`Licenses OK: ${String(packages.length)} production packages, report: ${REPORT_PATH}`);
}
