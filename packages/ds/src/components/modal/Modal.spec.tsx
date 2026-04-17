import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import Modal from './Modal';

// Mocks
jest.mock('../../elements', () => ({
    Icon: (props: any) => <span data-testid="mock-icon" {...props} />,
    Text: (props: any) => <h2 data-testid="mock-text" {...props} />,
}));
jest.mock('../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('<Modal/>', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        children: <div>Conteúdo do modal</div>,
        title: 'Título do Modal',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Modal {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-modal');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-modal__content', { exact: false });
    });

    it('should not render when isOpen is false', () => {
        renderComponent({ isOpen: false });
        expect(screen.queryByTestId('ds-modal')).not.toBeInTheDocument();
    });

    it('should render the title', () => {
        renderComponent();
        expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    });

    it('should render children', () => {
        renderComponent();
        expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
    });

    it('should call onClose when backdrop is clicked', () => {
        renderComponent();
        fireEvent.click(screen.getByTestId('ds-modal-backdrop'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when ESC is pressed', () => {
        renderComponent();
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when close button is clicked', () => {
        renderComponent();
        const closeBtn = screen.getByTestId('ds-modal-close');
        fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should apply custom width and maxHeight', () => {
        renderComponent({ width: '700px', maxHeight: '60vh' });
        const modal = screen.getByTestId('ds-modal');
        expect(modal).toHaveStyle('width: 700px');
        expect(modal).toHaveStyle('max-height: 60vh');
    });

    it('should render custom close icon', () => {
        renderComponent({ customCloseIcon: <span data-testid="custom-close">X</span> });
        expect(screen.getByTestId('custom-close')).toBeInTheDocument();
    });

    it('should set correct ARIA attributes', () => {
        renderComponent();
        const modal = screen.getByTestId('ds-modal');
        expect(modal).toHaveAttribute('role', 'dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('aria-labelledby', 'ds-modal-title');
        expect(modal).toHaveAttribute('aria-describedby', 'ds-modal-description');
    });

    it('should block background scroll when open', () => {
        renderComponent();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore background scroll when closed', () => {
        renderComponent();
        cleanup();
        expect(document.body.style.overflow).toBe('auto');
    });

    it('should not call onClose when backdrop is clicked if closeOnOutsideClick is false', () => {
        renderComponent({ closeOnOutsideClick: false });
        fireEvent.click(screen.getByTestId('ds-modal-backdrop'));
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should keep focus inside modal when tabbing', () => {
        renderComponent({
            children: <>
                <button data-testid="btn1">Btn1</button>
                <button data-testid="btn2">Btn2</button>
            </>
        });
        const modal = screen.getByTestId('ds-modal');
        modal.focus();
        expect(modal).toHaveFocus();

        const closeBtn = screen.getByTestId('ds-modal-close');
        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
        closeBtn.focus();
        expect(closeBtn).toHaveFocus();

        const btn1 = screen.getByTestId('btn1');
        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
        btn1.focus();
        expect(btn1).toHaveFocus();

        const btn2 = screen.getByTestId('btn2');
        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
        btn2.focus();
        expect(btn2).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
        modal.focus();
        expect(modal).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab', shiftKey: true });
        btn2.focus();
        expect(btn2).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab', shiftKey: true });
        btn1.focus();
        expect(btn1).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab', shiftKey: true });
        closeBtn.focus();
        expect(closeBtn).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Tab', code: 'Tab', shiftKey: true });
        modal.focus();
        expect(modal).toHaveFocus();
    });

    it('should restore focus to the previously focused element when closing the modal.', () => {
        render(
            <>
                <button data-testid="external-btn">Open modal</button>
                <div id="portal-root"></div>
            </>
        );
        const externalBtn = screen.getByTestId('external-btn');
        externalBtn.focus();
        expect(externalBtn).toHaveFocus();

        const { rerender } = render(
            <>
                <button data-testid="external-btn">Open modal</button>
                <Modal
                    isOpen={true}
                    onClose={mockOnClose}
                    title="Título do Modal"
                >
                    Conteúdo do modal
                </Modal>
            </>
        );

        const modal = screen.getByTestId('ds-modal');
        expect(modal).toHaveFocus();

        rerender(
            <>
                <button data-testid="external-btn">Open modal</button>
                <Modal
                    isOpen={false}
                    onClose={mockOnClose}
                    title="Modal Title"
                >
                    Modal content
                </Modal>
            </>
        );

        const externalBtns = screen.getAllByTestId('external-btn');
        expect(externalBtns).toHaveLength(2);
        expect(externalBtns[0]).toHaveFocus();
    });


});