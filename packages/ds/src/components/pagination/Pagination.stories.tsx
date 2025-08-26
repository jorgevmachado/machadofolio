import type { Meta, StoryObj } from '@storybook/react-vite';

import Pagination from './Pagination';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'dots',
        range: 10,
        total: 20,
        fluid: false,
    },
    title: 'Components/Pagination',
    argTypes: {},
    component: Pagination,
    parameters: {},
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const LimitDots: Story = {
    args: {
        limitDots: true
    }
};

export const Fluid: Story = {
    args: {
        fluid: true,
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
    }
};

export const TypeNumbers: Story = {
    args: {
        type: 'numbers',
    }
};

export const HidePagination: Story = {
    args: {
        hide: true,
    }
};

export const HideButtons: Story = {
    args: {
        hideButtons: true,
    }
};
