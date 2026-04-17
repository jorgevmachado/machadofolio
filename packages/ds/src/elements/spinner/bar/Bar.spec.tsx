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

import SpinnerBar from './Bar';

describe('<Bar/>', () => {
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
        return render(<SpinnerBar {...defaultProps} {...props} data-testid="ds-spinner"/>);
    }

    it('should render component props default.', () => {
        renderComponent();
        const spinnerBar = screen.getByTestId('ds-spinner-bar');
        expect(spinnerBar).toBeInTheDocument();
        expect(spinnerBar).toHaveClass('ds-spinner-bar');
        const spinnerBarContent = screen.getByTestId('ds-spinner-bar-content');
        expect(spinnerBarContent).toBeInTheDocument();
        expect(spinnerBarContent).toHaveClass('ds-spinner-bar__context--primary');
    })
})