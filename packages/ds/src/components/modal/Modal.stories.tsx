import type { Meta, StoryObj } from '@storybook/react-vite';

import Modal from './Modal';
import { fn } from 'storybook/test';
import React from 'react';
import Button from '../button';

type ModalProps = React.ComponentProps<typeof Modal>;

const meta = {
    tags: ['autodocs'],
    args: {
        isOpen: false,
        children: 'Hello, World!',
        onClose: fn(),
        context: 'primary'
    },
    title: 'Components/Modal',
    argTypes: {},
    component: Modal,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: '100vh' }}>
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const CustomModal: React.FC<ModalProps> = (props) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(props.isOpen);

    const handleOnClose = () => {
        setIsOpen(false);
        props.onClose();
    }

    return isOpen ? (
        <Modal {...props} isOpen={isOpen} onClose={handleOnClose}/>
        ) : (
        <Button context={props.context} onClick={() => setIsOpen(true)}>Open Modal</Button>
    )
}

export const Default: Story = {
    args: {},
    render: (args) => {
        return <CustomModal {...args}/>
    }
};