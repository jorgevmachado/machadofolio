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

jest.mock('./circle', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="ds-spinner-circle"/>),
}));

jest.mock('./dots', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="ds-spinner-dots"/>),
}));

jest.mock('./bar', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="ds-spinner-bar"/>),
}));

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
        expect(spinner).toHaveClass('ds-spinner');
        expect(screen.getByTestId('ds-spinner-circle')).toBeInTheDocument();
    });

    it('should render component with type dots.', () => {
        renderComponent({ type: 'dots' });
        const spinner = screen.getByTestId('ds-spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('ds-spinner');
        expect(screen.getByTestId('ds-spinner-dots')).toBeInTheDocument();
    });

    it('should render component with type bar.', () => {
        renderComponent({ type: 'bar' });
        const spinner = screen.getByTestId('ds-spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('ds-spinner');
        expect(screen.getByTestId('ds-spinner-bar')).toBeInTheDocument();
    });
});