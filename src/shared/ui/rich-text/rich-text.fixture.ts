import type { RichTextDocument } from '@/shared/lib/rich-text';

const text = (value: string, marks?: RichTextDocument['marks']): RichTextDocument => ({
  type: 'text',
  text: value,
  marks,
});
const paragraph = (...content: RichTextDocument[]): RichTextDocument => ({ type: 'paragraph', content });
const item = (value: string): RichTextDocument => ({ type: 'listItem', content: [paragraph(text(value))] });

export const ARTICLE_DOCUMENT: RichTextDocument = {
  type: 'doc',
  content: [
    paragraph(
      text('Работодатели обязаны вносить в ЕСУТД сведения о трудовых договорах. Подробнее — на '),
      text('eGov', [{ type: 'link', attrs: { href: 'https://egov.kz' } }]),
      text('.'),
    ),
    { type: 'heading', attrs: { level: 2 }, content: [text('Что проверить в кадровом учёте')] },
    {
      type: 'checkList',
      content: [
        item('Все действующие трудовые договоры зарегистрированы в ЕСУТД'),
        item('Дополнительные соглашения внесены после каждого изменения условий'),
      ],
    },
    { type: 'heading', attrs: { level: 3 }, content: [text('Порядок действий')] },
    { type: 'orderedList', content: [item('Откройте реестр договоров'), item('Сверьте данные работников')] },
    {
      type: 'callout',
      attrs: { variant: 'warning' },
      content: [paragraph(text('Размер штрафа уточняйте в действующей редакции КоАП РК.', [{ type: 'bold' }]))],
    },
  ],
};
