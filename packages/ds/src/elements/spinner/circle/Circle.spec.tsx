import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../../utils', () => {
    const originalModule = jest.requireActual('../../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

import SpinnerCircle from './Circle';

describe('<Circle/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const defaultProps = {
        size: 32,
        context: 'primary',
    };

    const renderComponent = (props: any = {}) => {
        return render(<SpinnerCircle {...defaultProps} {...props} data-testid="ds-spinner"/>);
    }

    it('should render component props default.', () => {
        renderComponent();
        const spinnerCircle = screen.getByTestId('ds-spinner-circle');
        expect(spinnerCircle).toBeInTheDocument();
        expect(spinnerCircle).toHaveClass('ds-spinner-circle__context--primary');
    })
})