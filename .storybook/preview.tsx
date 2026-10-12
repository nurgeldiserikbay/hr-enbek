import '../src/app/styles/globals.css';

import type { Preview } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';

import messages from '../messages/ru.json';

const preview: Preview = {
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ru" messages={messages} timeZone="Asia/Almaty">
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
