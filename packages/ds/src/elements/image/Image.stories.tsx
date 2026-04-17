import type { Meta, StoryObj } from '@storybook/react-vite';

import Image from './Image';

const src =
    'https://w7.pngwing.com/pngs/173/127/png-transparent-geek-logo-graphy-others-photography-artwork-sales-thumbnail.png';

const meta = {
    tags: ['autodocs'],
    args: {
        lazyLoad: false,
        fallback: true,
    },
    title: 'Elements/Image',
    argTypes: {
        src: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
            },
        },
        fit: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'cover' },
            },
            options: ['cover', 'contain'],
            control: { type: 'radio' },
        },
        fallback: {
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        lazyLoad: {
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
    },
    component: Image,
    decorators: [
        (Story) => (
            <div style={{
                display: 'flex',
                minHeight: '8rem',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Story/>
            </div>
        )
    ],
    parameters: {},
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: { src } };

export const ErrorUrl: Story = {  args: { src: 'Error_URL' } };

export const SrcUndefined: Story = {  args: { } };

export const WithLogo: Story = {  args: { type: 'brand' } };

export const WithNotFound: Story = {  args: { type: 'notfound' } };