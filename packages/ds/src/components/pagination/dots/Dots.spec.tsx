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

jest.mock('../../../elements', () => ({
    ProgressIndicator: ({ 'data-testid': dataTestId, ...props }: any) => (<div {...props} data-testid={dataTestId}/>),
}));

import Dots from './Dots';

describe('<Dots/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const defaultProps = {
        hide: false,
        total: 10,
        limit: false,
        selected: 1,
    }

    const renderComponent = (props: any = {}) => {
        return render(<Dots {...defaultProps} {...props} context="primary"/>);
    }

    it('should render with default props', () => {
        renderComponent();
        expect(screen.getByTestId('ds-pagination-dots')).toBeInTheDocument();
    });

    it('should not render component when hide is true', () => {
        renderComponent({ hide: true });
        expect(screen.queryByTestId('ds-pagination-dots')).not.toBeInTheDocument();
    });

    it('should render when limit is true', () => {
        renderComponent({ limit: true });
        expect(screen.getByTestId('ds-pagination-dots')).toBeInTheDocument();
    });

    it('should render when limit is true and selected equal 4', () => {
        renderComponent({ limit: true, selected: 4 });
        expect(screen.getByTestId('ds-pagination-dots')).toBeInTheDocument();
    });

    it('should render when limit is true and selected equal 9', () => {
        renderComponent({ limit: true, selected: 9 });
        expect(screen.getByTestId('ds-pagination-dots')).toBeInTheDocument();
    });

    it('should render when limit is true and selected equal total', () => {
        renderComponent({ limit: true, selected: defaultProps.total });
        expect(screen.getByTestId('ds-pagination-dots')).toBeInTheDocument();
    });
});