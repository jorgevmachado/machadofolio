import type { StorybookConfig } from '@storybook/react-vite';

import { dirname, join } from "path"

const currentBrand = process.env.BRAND || 'geek';
const brand = currentBrand.replace(/\s/g, '');

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest")
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  },
};

console.info('\x1b[34m[Storybook] Loading brand: %s\x1b[0m\n', brand);

export default config;