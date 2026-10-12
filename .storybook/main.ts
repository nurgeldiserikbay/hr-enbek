import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  core: { disableTelemetry: true },
};

export default config;
