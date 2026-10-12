import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import globalsCss from './globals.css?raw';

interface Token {
  name: string;
  value: string;
}

const COLOR_TOKEN = /--color-([\w-]+): (#[\da-f]+|rgb\([^)]+\));/gu;
const RADIUS_TOKEN = /--radius-([\w-]+): ([^;]+);/gu;

function readTokens(pattern: RegExp): Token[] {
  return [...globalsCss.matchAll(pattern)].map(([, name = '', value = '']) => ({ name, value }));
}

const COLORS = readTokens(COLOR_TOKEN);

const COLOR_GROUPS = [...new Set(COLORS.map(({ name }) => name.split('-', 1)[0] ?? name))].map(
  (group) => [group, COLORS.filter(({ name }) => name.startsWith(`${group}-`))] as const,
);

function ColorPalette() {
  return (
    <div className="space-y-8">
      {COLOR_GROUPS.map(([group, tokens]) => (
        <section key={group}>
          <h2 className="mb-3 text-h5 text-text-heading">{group}</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {tokens.map(({ name, value }) => (
              <li key={name}>
                <div className="h-16 rounded-lg border border-border-default" style={{ backgroundColor: value }} />
                <p className="mt-2 text-body-s-medium text-text-heading">{name}</p>
                <p className="text-caption text-text-body">{value}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function RadiusScale() {
  return (
    <ul className="flex flex-wrap gap-6">
      {readTokens(RADIUS_TOKEN).map(({ name, value }) => (
        <li key={name} className="text-center">
          <div className="size-20 border-2 border-brand-primary bg-brand-tint" style={{ borderRadius: value }} />
          <p className="mt-2 text-body-s-medium text-text-heading">rounded-{name}</p>
          <p className="text-caption text-text-body">{value}</p>
        </li>
      ))}
    </ul>
  );
}

const meta = {
  title: 'foundations/Tokens',
  component: ColorPalette,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ColorPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {};

export const Radius: Story = { render: () => <RadiusScale /> };
