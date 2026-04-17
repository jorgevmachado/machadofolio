import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('../button', () => ({
    __esModule: true,
    default: (props: any) => <button {...props}>{props.children}</button>,
}));

jest.mock('./dots', () => ({
    __esModule: true,
    default: (props: any) => (
        <div {...props} data-testid="ds-pagination-dots">
            <span data-testid="ds-pagination-dots-item-0" />
            <span data-testid="ds-pagination-dots-item-1" />
            <span data-testid="ds-pagination-dots-item-2" />
            <span data-testid="ds-pagination-dots-item-3" />
            <span data-testid="ds-pagination-dots-item-4" />
            <span data-testid="ds-pagination-dots-item-5" />
        </div>
    ),
}));

jest.mock('./numbers', () => ({
    __esModule: true,
    default: () => {
        return (
            <>
                <button data-testid="ds-pagination-numbers-1">1</button>
                <button data-testid="ds-pagination-numbers-2">2</button>
                <button data-testid="ds-pagination-numbers-3">3</button>
                <button data-testid="ds-pagination-numbers-4">4</button>
                <button data-testid="ds-pagination-numbers-5">5</button>
            </>
        )
    },
}));

import Pagination from './Pagination';

describe('<Pagination/>', () => {
    const mockHandlePrev = jest.fn();
    const mockHandleNext = jest.fn();
    const mockHandleNew = jest.fn();
    const defaultProps = {
        hide: false,
        type: 'dots',
        range: 10,
        total: 20,
        fluid: false,
        current: 1,
        disabled: false,
        limitDots: false,
        handleNew: mockHandleNew,
        handleNext: mockHandleNext,
        handlePrev: mockHandlePrev,
        hideButtons: false,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Pagination {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-pagination');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-pagination');
        expect(screen.getByTestId('ds-pagination-dots')).toBeInTheDocument();
    });

    it('should render component with flag fluid is true.', () => {
        renderComponent({ fluid: true });
        const component = screen.getByTestId('ds-pagination');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-pagination');
        expect(component).toHaveClass('ds-pagination__fluid');
    });

    it('should render component with flag hide is true.', () => {
        renderComponent({ hide: true });
        const component = screen.getByTestId('ds-pagination-items');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-pagination__items');
        expect(component).toHaveClass('ds-pagination__items--hide');
    });

    it('should render component with flag disabled is true.', () => {
        renderComponent({ disabled: true });
        const buttonPrev = screen.getByTestId('ds-pagination-button-prev');
        expect(buttonPrev).toBeInTheDocument();
        expect(buttonPrev).toBeDisabled();
        const buttonNext = screen.getByTestId('ds-pagination-button-next');
        expect(buttonNext).toBeInTheDocument();
        expect(buttonNext).not.toBeDisabled();
    });

    it('should render component with type numbers.', () => {
        renderComponent({ type: 'numbers' });
        const component = screen.getByTestId('ds-pagination');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-pagination');
        expect(screen.getByTestId('ds-pagination-numbers-1')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pagination-numbers-2')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pagination-numbers-3')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pagination-numbers-4')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pagination-numbers-5')).toBeInTheDocument();
    });

    it('should click in button next and prev.', () => {
        renderComponent({ type: 'numbers' });
        const buttonNext = screen.getByTestId('ds-pagination-button-next');
        expect(buttonNext).toBeInTheDocument();
        expect(buttonNext).not.toBeDisabled();
        buttonNext.click();
        expect(mockHandleNext).toHaveBeenCalled();


        const buttonPrev = screen.getByTestId('ds-pagination-button-prev');
        expect(buttonPrev).toBeInTheDocument();
        expect(buttonPrev).not.toBeDisabled();
        buttonPrev.click();
        expect(mockHandlePrev).toHaveBeenCalled();
    });

    it('should click in button prev with current is equal 2.', () => {
        renderComponent({ type: 'numbers', current: 2 });
        const buttonPrev = screen.getByTestId('ds-pagination-button-prev');
        expect(buttonPrev).toBeInTheDocument();
        expect(buttonPrev).not.toBeDisabled();
        buttonPrev.click();
        expect(mockHandlePrev).toHaveBeenCalled();
    });

    it('should click in button next with current is equal 20.', () => {
        renderComponent({ type: 'numbers', current: 20 });
        const buttonNext = screen.getByTestId('ds-pagination-button-next');
        expect(buttonNext).toBeInTheDocument();
        expect(buttonNext).not.toBeDisabled();
        buttonNext.click();
        expect(mockHandleNext).toHaveBeenCalled();
    });

    it('should click in button next and dispatch handleNew.', () => {
        const { rerender } = renderComponent({ type: 'numbers', current: 1 });
        const buttonNext = screen.getByTestId('ds-pagination-button-next');
        expect(buttonNext).toBeInTheDocument();
        expect(buttonNext).not.toBeDisabled();
        buttonNext.click();
        expect(mockHandleNext).toHaveBeenCalled();
        rerender(<Pagination {...defaultProps} type="numbers" {...{ current: 2 }}/>);
        expect(mockHandleNew).toHaveBeenCalledWith(2);
    });
});