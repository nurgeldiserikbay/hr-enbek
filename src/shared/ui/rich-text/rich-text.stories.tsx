import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RichText } from './rich-text.tsx';

const meta = {
  title: 'shared/ui/RichText',
  component: RichText,
  args: {
    className: 'max-w-180',
    html: [
      '<p>Работодатели обязаны вносить в ЕСУТД сведения о заключении, изменении и прекращении трудовых договоров. Подробнее — на <a href="https://egov.kz">eGov</a>.</p>',
      '<h2>Что проверить в кадровом учёте</h2>',
      '<ul><li>Все действующие трудовые договоры зарегистрированы в ЕСУТД</li><li>Дополнительные соглашения внесены после каждого изменения условий</li></ul>',
      '<h3>Порядок действий</h3>',
      '<ol><li>Откройте реестр договоров</li><li>Сверьте данные работников</li></ol>',
      '<blockquote><p>Размер штрафа и точные сроки внесения сведений уточняйте в действующей редакции КоАП РК и Трудового кодекса РК.</p></blockquote>',
    ].join(''),
  },
} satisfies Meta<typeof RichText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdminContent: Story = {};
