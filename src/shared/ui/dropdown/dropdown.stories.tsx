import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Dropdown } from './dropdown.tsx';

const meta = {
  title: 'shared/ui/Dropdown',
  component: Dropdown,
  args: {
    trigger: 'Ответы на все вопросы',
    triggerClassName: 'text-body-s text-text-body',
    children: (
      <ul>
        {['Нормативные акты', 'Инструкции', 'Видеоинструкции'].map((item) => (
          <li key={item}>
            <a href="#dropdown" className="flex h-11 items-center rounded-lg px-3 text-body-m hover:bg-surface-soft">
              {item}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
    side: { control: 'inline-radio', options: ['bottom', 'top'] },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dropdown>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
