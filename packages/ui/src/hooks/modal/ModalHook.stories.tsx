import React from 'react';
import { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '@repo/ds';

import { useModal } from './ModalContext';



const meta: Meta = {
    title: 'Hooks/Modal',
    parameters: {
        docs: {
            description: {
                component: 'Exemplo do uso do hook useModal (ModalContext) para exibir um Modal de contexto.'
            }
        }
    },
    decorators: [
        (Story) => (
            <div style={{ height: '100vh' }}>
                <Story/>
            </div>
        ),
    ],
};

export default meta;

export const Default: StoryObj = {
    render: () => {
        const { modal, openModal } = useModal();

        return (
            <div>
                <Button
                    context="primary"
                    onClick={() =>
                        openModal({
                            title: 'Modal aberto por contexto',
                            body: (
                                <div>
                                    <p>Conteúdo do modal via contexto!</p>
                                </div>
                            ),
                        })
                    }
                >
                    Abrir modal
                </Button>
                {modal}
            </div>
        );
    }
};