import { readFileSync } from 'node:fs';
import path from 'node:path';

export const KNOWN_DESIGN_VIOLATIONS: [foreground: string, background: string][] = [
  ['brand-on-primary', 'brand-primary'],
  ['brand-on-primary', 'brand-primary-hover'],
  ['brand-primary', 'surface-card'],
  ['brand-primary', 'surface-soft'],
  ['brand-primary', 'surface-page'],
  ['brand-primary', 'brand-tint'],
  ['brand-tint', 'brand-primary'],
  ['brand-primary-text', 'surface-card'],
  ['brand-primary-text', 'surface-page'],
  ['brand-primary-text', 'brand-tint'],
  ['status-success', 'status-success-bg'],
  ['text-muted', 'surface-page'],
  ['text-muted', 'surface-card'],
  ['text-muted', 'surface-soft'],
  ['text-placeholder', 'surface-card'],
  ['text-legal-link', 'surface-card'],
];

const globalsCss = readFileSync(path.join(import.meta.dirname, 'globals.css'), 'utf8');

export const COLOR_TOKENS = new Map(
  [...globalsCss.matchAll(/--color-([\w-]+):\s*(#[\da-f]+);/giu)].map(([, name = '', value = '']) => [name, value]),
);

const toLongHex = (hex = '') => hex.toLowerCase().replace(/^#(.)(.)(.)$/u, '#$1$1$2$2$3$3');

export const KNOWN_VIOLATING_FOREGROUNDS = new Set(
  KNOWN_DESIGN_VIOLATIONS.map(([foreground]) => toLongHex(COLOR_TOKENS.get(foreground))),
);
