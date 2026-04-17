import type { StorybookConfig } from '@storybook/react-vite';

const currentBrand = process.env.BRAND || 'geek';
const brand = currentBrand.replace(/\s/g, '');

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
};

console.info('\x1b[34m[UI-Storybook] Loading brand: %s\x1b[0m\n', brand);

export default config;