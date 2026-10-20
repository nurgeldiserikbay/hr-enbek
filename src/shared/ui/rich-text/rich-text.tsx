import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import type { ReactElement, ReactNode } from 'react';

import { isSafeHref, type RichTextDocument, type RichTextNode } from '@/shared/lib/rich-text';
import { cn } from '@/shared/lib/styles';
import { ContentLink } from '@/shared/ui/content-link';
import { Info, Scale } from '@/shared/ui/icon';

type RichTextProps = Readonly<{
  document: RichTextDocument;
  className?: string;
  lang?: string;
}>;

type ListKind = 'bullet' | 'check' | 'ordered';

const WEB_URL = /^https?:\/\//iu;

const CALLOUT_STYLES = {
  warning: {
    box: 'bg-status-warning-bg text-status-warning-strong',
    icon: <Scale aria-hidden="true" className="absolute top-4.5 left-4 size-5 text-status-warning" />,
  },
  info: {
    box: 'bg-status-info-bg text-status-info',
    icon: <Info aria-hidden="true" className="absolute top-4.5 left-4 size-5 text-status-info" />,
  },
} as const;

const LIST_ITEM_CLASSES: Record<ListKind, string> = {
  bullet: 'pl-2 marker:text-text-body',
  check: 'relative pl-8',
  ordered: 'pl-2 marker:text-text-body',
};

const stringAttr = (node: RichTextNode, name: string): string | undefined => {
  const value = node.attrs?.[name];
  return typeof value === 'string' ? value : undefined;
};

const numberAttr = (node: RichTextNode, name: string): number | undefined => {
  const value = node.attrs?.[name];
  return typeof value === 'number' && Number.isInteger(value) ? value : undefined;
};

const LINK_CLASS = 'text-brand-primary-text underline underline-offset-2 hover:no-underline';

function wrapInMark(mark: NonNullable<RichTextNode['marks']>[number], content: ReactNode): ReactElement {
  switch (mark.type) {
    case 'bold': {
      return <strong className="font-semibold">{content}</strong>;
    }
    case 'italic': {
      return <em>{content}</em>;
    }
    case 'underline': {
      return <u>{content}</u>;
    }
    case 'link': {
      const href = mark.attrs?.['href'];
      return isSafeHref(href) ? (
        <ContentLink href={href} className={LINK_CLASS}>
          {content}
        </ContentLink>
      ) : (
        <>{content}</>
      );
    }
    default: {
      return <>{content}</>;
    }
  }
}

function MarkedText({ node }: Readonly<{ node: RichTextNode }>) {
  let content = <>{node.text ?? ''}</>;
  for (const mark of node.marks ?? []) content = wrapInMark(mark, content);
  return content;
}

function renderChildren(node: RichTextNode, list?: ListKind): ReactNode {
  return (node.content ?? []).map((child, index) => (
    // eslint-disable-next-line @eslint-react/no-array-index-key -- editor nodes have no ids and the document is rendered once on the server
    <RichTextBlock key={index} node={child} list={list} />
  ));
}

function RichTextImage({ node }: Readonly<{ node: RichTextNode }>) {
  const url = stringAttr(node, 'url');
  const alt = stringAttr(node, 'alt') ?? '';
  if (url === undefined || !WEB_URL.test(url)) return null;
  return (
    <Image
      src={url}
      alt={alt}
      width={numberAttr(node, 'width') ?? 0}
      height={numberAttr(node, 'height') ?? 0}
      sizes="(min-width: 1024px) 720px, 100vw"
      className="h-auto w-full rounded-xl"
    />
  );
}

function RichTextBlock({
  node,
  list,
}: Readonly<{ node: RichTextNode; list?: ListKind | undefined }>): ReactElement | null {
  switch (node.type) {
    case 'text': {
      return <MarkedText node={node} />;
    }
    case 'hardBreak': {
      return <br />;
    }
    case 'paragraph': {
      return <p>{renderChildren(node)}</p>;
    }
    case 'heading': {
      return numberAttr(node, 'level') === 3 ? (
        <h3 className="text-h4 text-text-heading">{renderChildren(node)}</h3>
      ) : (
        <h2 className="text-h3-sm text-text-heading lg:text-h3">{renderChildren(node)}</h2>
      );
    }
    case 'bulletList': {
      return <ul className="flex list-disc flex-col gap-3 pl-6 lg:gap-2.5">{renderChildren(node, 'bullet')}</ul>;
    }
    case 'checkList': {
      return <ul className="flex flex-col gap-3 lg:gap-2.5">{renderChildren(node, 'check')}</ul>;
    }
    case 'orderedList': {
      return (
        <ol start={numberAttr(node, 'start')} className="flex list-decimal flex-col gap-3 pl-6">
          {renderChildren(node, 'ordered')}
        </ol>
      );
    }
    case 'listItem': {
      const kind = list ?? 'bullet';
      return (
        <li className={cn(LIST_ITEM_CLASSES[kind], '[&>*+*]:mt-2')}>
          {kind === 'check' && (
            <CircleCheck
              aria-hidden="true"
              className="absolute top-0.75 left-0 size-5 fill-brand-primary text-surface-card"
            />
          )}
          {renderChildren(node)}
        </li>
      );
    }
    case 'blockquote': {
      return (
        <blockquote className="border-l-4 border-brand-primary pl-4 text-text-body [&>*+*]:mt-2">
          {renderChildren(node)}
        </blockquote>
      );
    }
    case 'callout': {
      const style = stringAttr(node, 'variant') === 'warning' ? CALLOUT_STYLES.warning : CALLOUT_STYLES.info;
      return (
        <div
          role="note"
          className={cn('relative rounded-xl p-4 pl-12 text-body-m-medium leading-5.5 [&>*+*]:mt-2', style.box)}
        >
          {style.icon}
          {renderChildren(node)}
        </div>
      );
    }
    case 'image': {
      return <RichTextImage node={node} />;
    }
    case 'horizontalRule': {
      return <hr className="border-border-default" />;
    }
    default: {
      return null;
    }
  }
}

export function RichText({ document, className, lang }: RichTextProps) {
  return (
    <div
      lang={lang}
      className={cn('text-body-m leading-6.5 text-text-heading lg:text-body-l lg:leading-6.5 [&>*+*]:mt-6', className)}
    >
      {renderChildren(document)}
    </div>
  );
}
