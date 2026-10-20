import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ARTICLE_DOCUMENT } from './rich-text.fixture.ts';
import { RichText } from './rich-text.tsx';

const meta = {
  title: 'shared/ui/RichText',
  component: RichText,
  args: {
    className: 'max-w-180',
    document: ARTICLE_DOCUMENT,
  },
} satisfies Meta<typeof RichText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EditorDocument: Story = {};

export const InfoCalloutQuoteAndBullets: Story = {
  args: {
    document: {
      type: 'doc',
      content: [
        {
          type: 'callout',
          attrs: { variant: 'info' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Сервис доступен круглосуточно.' }] }],
        },
        {
          type: 'blockquote',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Цитата из Трудового кодекса.' }] }],
        },
        { type: 'horizontalRule' },
        {
          type: 'bulletList',
          content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Пункт' }] }] }],
        },
      ],
    },
  },
};
