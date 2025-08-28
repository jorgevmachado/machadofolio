import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from '@repo/ds';

import { useModal } from './ModalContext';

function TestConsumer() {
    const { modal, openModal } = useModal();

    return (
        <div>
            <Button
                context="primary"
                onClick={() => openModal({
                    title: 'Modal Title',
                    body: (
                        <div>
                            <p>Modal Content</p>
                        </div>
                    )
                })}
                data-testid="open-modal"
            >
                Open Modal
            </Button>
            {modal}
        </div>
    )
}

describe('Modal Hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Does not display modal when dont click in Open Modal', () => {
        render(<TestConsumer/>);
        expect(screen.queryByTestId('mocked-ds-modal')).not.toBeInTheDocument();
    });

    it('Should open modal', () => {
        render(<TestConsumer/>);
        const buttonOpenModal = screen.getByTestId('open-modal');
        fireEvent.click(buttonOpenModal);
        expect(screen.getByTestId('mocked-ds-modal')).toBeInTheDocument();
    });

    it('Should open modal and close', () => {
        render(<TestConsumer/>);
        const buttonOpenModal = screen.getByTestId('open-modal');
        expect(buttonOpenModal).toBeInTheDocument();
        fireEvent.click(buttonOpenModal);
        expect(screen.getByTestId('mocked-ds-modal')).toBeInTheDocument();

        const buttonCloseModal = screen.getByTestId('mocked-ds-modal-close');
        expect(buttonCloseModal).toBeInTheDocument();
        fireEvent.click(buttonCloseModal);
        expect(screen.queryByTestId('mocked-ds-modal')).not.toBeInTheDocument();
    });
});