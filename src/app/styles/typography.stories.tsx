import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const SAMPLE = 'Портал трудовых ресурсов упрощает процессы кадрового делопроизводства';

const TEXT_STYLES = [
  { className: 'text-display', figma: 'Display/H1 · 56', spec: 'Inter Bold · 56/64' },
  { className: 'text-h1', figma: 'Heading/H1 · 44', spec: 'Inter Bold · 44/48' },
  { className: 'text-h1-sm', figma: 'Heading/H1 · 40', spec: 'Inter Bold · 40/48' },
  { className: 'text-h2', figma: 'Heading/H2 · 36', spec: 'Inter Bold · 36/44' },
  { className: 'text-h2-sm', figma: 'Heading/H4 · 32 (screens)', spec: 'Inter Semi Bold · 32/38' },
  { className: 'text-h2-xs', figma: 'Mobile hero · 28 (screens)', spec: 'Inter Bold · 28/34' },
  { className: 'text-h3', figma: 'Heading/H3 · 24', spec: 'Inter Semi Bold · 24/30' },
  { className: 'text-h3-sm', figma: 'Mobile question · 22 (screens)', spec: 'Inter Semi Bold · 22/28' },
  { className: 'text-h4', figma: 'Heading/H4 · 20', spec: 'Inter Semi Bold · 20/26' },
  { className: 'text-h5', figma: 'Heading/H5 · 18', spec: 'Inter Semi Bold · 18/26' },
  { className: 'text-body-l', figma: 'Body/L · 16', spec: 'Inter Regular · 16/24' },
  { className: 'text-body-l-medium', figma: 'Body/L Medium · 16', spec: 'Inter Medium · 16/24' },
  { className: 'text-body-m', figma: 'Body/M · 15', spec: 'Inter Regular · 15/22' },
  { className: 'text-body-m-medium', figma: 'Body/M Medium · 15', spec: 'Inter Medium · 15/20' },
  { className: 'text-body-m-semibold', figma: 'Body/M Semibold · 15', spec: 'Inter Semi Bold · 15/20' },
  { className: 'text-body-s', figma: 'Body/S · 14', spec: 'Inter Regular · 14/20' },
  { className: 'text-body-s-medium', figma: 'Body/S Medium · 14', spec: 'Inter Medium · 14/20' },
  { className: 'text-caption', figma: 'Caption · 13', spec: 'Inter Regular · 13/18' },
  { className: 'text-label', figma: 'Label · 12', spec: 'Inter Medium · 12/16' },
  { className: 'text-overline', figma: 'Overline · 12', spec: 'Inter Bold · 12/16' },
  { className: 'text-number-2xl', figma: 'Heading/H2 · 48 (screens)', spec: 'Inter Semi Bold · 48/58' },
  { className: 'text-number-xl', figma: 'Number/XL · 44', spec: 'Inter Bold · 44/48' },
  { className: 'text-number-l', figma: 'Number/L · 30', spec: 'Inter Bold · 30/34' },
] as const;

function TypographyScale() {
  return (
    <dl className="grid max-w-5xl grid-cols-[14rem_1fr] gap-x-8 gap-y-6">
      {TEXT_STYLES.map(({ className, figma, spec }) => (
        <div key={className} className="contents">
          <dt>
            <p className="text-body-s-medium text-text-heading">{figma}</p>
            <p className="text-caption text-text-body">
              {spec} · <code>{className}</code>
            </p>
          </dt>
          <dd className={`${className} text-text-heading`}>
            {className.startsWith('text-number') ? '6,9 млн' : SAMPLE}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const meta = {
  title: 'foundations/Typography',
  component: TypographyScale,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TypographyScale>;

export default meta;

export const Scale: StoryObj<typeof meta> = {};

export const Overrides: StoryObj<typeof meta> = {
  render: () => (
    <div className="space-y-4 text-text-heading">
      <p className="text-h2">text-h2</p>
      <p className="text-h2 font-medium">text-h2 font-medium</p>
      <p className="text-h2 leading-none">text-h2 leading-none</p>
      <p className="text-h3 md:text-h1">text-h3 md:text-h1</p>
    </div>
  ),
};
