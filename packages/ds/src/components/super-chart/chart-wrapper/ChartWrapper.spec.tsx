import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../card', () => ({
    __esModule: true,
    Card: (props: any) => (<div {...props}/>),
    default: (props: any) => (<div {...props}/>),
}));

import ChartWrapper from './ChartWrapper';

describe('<ChartWrapper/>', () => {
    const defaultProps = {
        children: 'children',
    };

    const renderComponent = (props: any = {}) => {
        return render(<ChartWrapper {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-chart-wrapper-default')).toBeInTheDocument();
    });

    it('should render component with type card.', () => {
        renderComponent({ type: 'card' });
        expect(screen.getByTestId('ds-chart-wrapper-card')).toBeInTheDocument();
    });
});