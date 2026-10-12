import { COLOR_TOKENS, KNOWN_DESIGN_VIOLATIONS } from './known-design-violations.ts';

const WCAG_AA_NORMAL_TEXT = 4.5;
const LINEAR_THRESHOLD = 0.03928;

const readToken = (name: string): string => {
  const value = COLOR_TOKENS.get(name);
  if (value?.length !== 4 && value?.length !== 7) {
    throw new Error(`Token --color-${name} is not defined as a #rgb or #rrggbb color`);
  }
  return value;
};

const expandHex = (hex: string): string => hex.replace(/^#(.)(.)(.)$/u, '#$1$1$2$2$3$3');

const channelLuminance = (channel: number): number => {
  const value = channel / 255;
  return value <= LINEAR_THRESHOLD ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (hex: string): number => {
  const full = expandHex(hex);
  const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((offset) =>
    channelLuminance(Number.parseInt(full.slice(offset, offset + 2), 16)),
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (foreground: string, background: string): number => {
  const [lighter = 0, darker = 0] = [relativeLuminance(foreground), relativeLuminance(background)].toSorted(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const TEXT_PAIRS: [foreground: string, background: string][] = [
  ['text-heading', 'surface-page'],
  ['text-heading', 'surface-card'],
  ['text-body', 'surface-page'],
  ['text-body', 'surface-card'],
  ['text-inverse', 'surface-dark'],
  ['status-warning', 'status-warning-bg'],
  ['status-danger', 'status-danger-bg'],
  ['status-info', 'status-info-bg'],
];

describe('design tokens contrast', () => {
  it.each(TEXT_PAIRS)('IR-UI-07: %s on %s meets WCAG 2.1 AA (4.5:1)', (foreground, background) => {
    expect(contrastRatio(readToken(foreground), readToken(background))).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
  });

  it.fails.each(KNOWN_DESIGN_VIOLATIONS)(
    'IR-UI-07 known design violation, move to TEXT_PAIRS once fixed in Figma: %s on %s',
    (foreground, background) => {
      expect(contrastRatio(readToken(foreground), readToken(background))).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    },
  );
});
