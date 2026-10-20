import { z } from 'zod';

const markSchema = z.object({
  type: z.string(),
  attrs: z.record(z.string(), z.unknown()).optional(),
});

export interface RichTextNode {
  type: string;
  attrs?: Readonly<Record<string, unknown>> | undefined;
  content?: readonly RichTextNode[] | undefined;
  marks?: readonly z.infer<typeof markSchema>[] | undefined;
  text?: string | undefined;
}

const richTextNodeSchema: z.ZodType<RichTextNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(richTextNodeSchema).optional(),
    marks: z.array(markSchema).optional(),
    text: z.string().optional(),
  }),
);

export const richTextDocumentSchema = richTextNodeSchema.refine((node) => node.type === 'doc');

export type RichTextDocument = RichTextNode;

const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/(?!\/))/iu;

export const isSafeHref = (href: unknown): href is string => typeof href === 'string' && SAFE_HREF.test(href);
