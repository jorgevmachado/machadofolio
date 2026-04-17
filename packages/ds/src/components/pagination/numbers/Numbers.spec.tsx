import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    isNumberEven: (n: number) => n % 2 === 0
}));

jest.mock('../../button', () => ({
    __esModule: true,
    default: (props: any) => <button {...props}>{props.children}</button>,
}));

import Numbers from './Numbers';

describe('<Numbers/>', () => {
    const mockOnClick = jest.fn();

    const defaultProps = {
        hide: false,
        total: 20,
        range: 10,
        onClick: mockOnClick,
        selected: 1,
    }

    const renderComponent = (props: any = {}) => {
        return render(<Numbers {...defaultProps} {...props} context="primary"/>);
    }

    it('should not render component when hide is true', () => {
        renderComponent({ hide: true })
        expect(screen.queryByTestId('ds-pagination-numbers-1')).not.toBeInTheDocument();
    });

    it('should render component when selected is 15', () => {
        renderComponent({ selected: 15 });
        [10,11,12,13,14,15,16,17,18,19].forEach((item) => {
            expect(screen.getByTestId(`ds-pagination-numbers-${item}`)).toBeInTheDocument();
        })
    });

    it('should render component when selected is 16', () => {
        renderComponent({ selected: 16 });
        [11,12,13,14,15,16,17,18,19,20].forEach((item) => {
            expect(screen.getByTestId(`ds-pagination-numbers-${item}`)).toBeInTheDocument();
        })
    });

    it('should render component when selected is 21 and range is undefined', () => {
        renderComponent({ selected: 21, range: undefined });
        expect(screen.queryByTestId(`ds-pagination-numbers-1`)).not.toBeInTheDocument();
    });

    it('should render component when hide is false', () => {
        renderComponent();
        [1,2,3,4,5,6,7,8,9,10].forEach((item) => {
            expect(screen.getByTestId(`ds-pagination-numbers-${item}`)).toBeInTheDocument();
        })
    });

    it('should render component when range is undefined', () => {
        renderComponent({ range: undefined });
        expect(screen.getByTestId(`ds-pagination-numbers-1`)).toBeInTheDocument();
    });

    it('should render component when range is 7 and selected is 15', () => {
        renderComponent({ range: 7, selected: 15 });
        [12,13,14,15,16,17,18].forEach((item) => {
            expect(screen.getByTestId(`ds-pagination-numbers-${item}`)).toBeInTheDocument();
        })
    });

    it('should render component when range is better than total', () => {
        renderComponent({ range: 21, selected: 9 });
        [10,11,12,13,14,15,16,17,18,19].forEach((item) => {
            expect(screen.getByTestId(`ds-pagination-numbers-${item}`)).toBeInTheDocument();
        })
    });

    it('should click in button', () => {
        renderComponent();
        const button = screen.getByTestId(`ds-pagination-numbers-1`);
        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledWith(1);
    });
});