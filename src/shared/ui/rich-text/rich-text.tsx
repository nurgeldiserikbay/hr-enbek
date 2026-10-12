import { cn } from '@/shared/lib/styles';

type RichTextProps = Readonly<{
  html: string;
  className?: string;
}>;

const RICH_TEXT_CLASSES = [
  'text-body-m leading-6.5 text-text-heading lg:text-body-l lg:leading-6.5',
  '[&>*+*]:mt-6',
  '[&_h2]:text-h3-sm [&_h2]:text-text-heading lg:[&_h2]:text-h3',
  '[&_h3]:text-h4 [&_h3]:text-text-heading',
  '[&_h4]:text-h5 [&_h4]:text-text-heading',
  '[&_strong]:font-semibold [&_b]:font-semibold',
  '[&_a]:text-brand-primary-text [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline',
  '[&_ul>li]:relative [&_ul>li]:pl-8 [&_li+li]:mt-3 lg:[&_ul>li+li]:mt-2.5',
  '[&_ul>li]:before:absolute [&_ul>li]:before:top-0.75 [&_ul>li]:before:left-0 [&_ul>li]:before:size-5',
  '[&_ul>li]:before:bg-brand-primary [&_ul>li]:before:mask-[url(/rich-text/circle-check.svg)] [&_ul>li]:before:mask-contain [&_ul>li]:before:mask-no-repeat',
  "[&_ul>li]:before:content-['']",
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol>li]:pl-2 [&_ol>li]:marker:text-text-body',
  '[&_blockquote]:relative [&_blockquote]:rounded-xl [&_blockquote]:bg-status-warning-bg [&_blockquote]:p-4 [&_blockquote]:pl-12',
  '[&_blockquote]:text-body-m-medium [&_blockquote]:leading-5.5 [&_blockquote]:text-status-warning-strong',
  '[&_blockquote>*+*]:mt-2',
  '[&_blockquote]:before:absolute [&_blockquote]:before:top-4.5 [&_blockquote]:before:left-4 [&_blockquote]:before:size-5',
  '[&_blockquote]:before:bg-status-warning [&_blockquote]:before:mask-[url(/rich-text/scale.svg)] [&_blockquote]:before:mask-contain [&_blockquote]:before:mask-no-repeat',
  "[&_blockquote]:before:content-['']",
  '[&_hr]:border-border-default',
  '[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl',
  '[&_figcaption]:mt-2 [&_figcaption]:text-body-s [&_figcaption]:text-text-muted',
  '[&_table]:w-full [&_table]:text-body-s [&_td]:border [&_td]:border-border-default [&_td]:p-2',
  '[&_th]:border [&_th]:border-border-default [&_th]:bg-surface-soft [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold',
];

export function RichText({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(RICH_TEXT_CLASSES, className)}
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- admin body, sanitized by sanitizeRichText at the API boundary
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
