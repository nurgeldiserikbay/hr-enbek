import type { Rule } from 'eslint';

const ALLOWED_COMMENT_PATTERNS = [
  /^\s*eslint-disable(?:-next-line|-line)?\s+\S.*\s--\s+\S/u,
  /^\s*@ts-expect-error\s+\S/u,
  /^\/\s*<reference\s/u,
];

const isAllowedComment = (text: string): boolean => ALLOWED_COMMENT_PATTERNS.some((pattern) => pattern.test(text));

export const noComments: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow comments: intent belongs in names, tests and docs/adr',
    },
    schema: [],
    messages: {
      forbidden:
        'Comments are not allowed. Express intent with names, tests (with requirement IDs) or docs/adr. Allowed: "eslint-disable-next-line rule -- reason", "@ts-expect-error reason".',
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.loc && !isAllowedComment(comment.value)) {
            context.report({ loc: comment.loc, messageId: 'forbidden' });
          }
        }
      },
    };
  },
};
