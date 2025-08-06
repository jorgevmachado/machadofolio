import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

import Spinner from './Spinner';

describe('<Spinner/>', () => {
    const defaultProps = {
        size: 32,
        context: 'primary',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Spinner {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component props default.', () => {
        renderComponent({ size: undefined, context: undefined });
        const spinner = screen.getByTestId('ds-spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('ds-spinner__context--primary')
    })
});