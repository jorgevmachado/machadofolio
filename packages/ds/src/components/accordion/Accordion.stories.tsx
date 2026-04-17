import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '../../elements';

import Accordion from './Accordion';

const meta = {
    tags: ['autodocs'],
    args: {
        title: 'Accordion Title',
        isOpen: false,
        context: 'primary',
        children: 'Hello World',
        disabled: false,
        isBorderless: false,
        childrenTitle: undefined,
    },
    title: 'Components/Accordion',
    argTypes: {},
    component: Accordion,
    parameters: {},
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const Disabled: Story = {  args: { disabled: true } };

export const WithBorderless: Story = {  args: { isBorderless: true } };

export const WithChildrenTitle: Story = {
    args: {
        isOpen: true,
        childrenTitle: (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingRight: '4px',
                }}
            >
                <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
                    <Text>client name</Text>
                </div>
            </div>
        )
    },
};