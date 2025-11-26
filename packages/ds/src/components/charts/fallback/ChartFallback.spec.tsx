import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../../utils', () => {
    const originalModule = jest.requireActual('../../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../../elements', () => ({
    __esModule: true,
    default: (props: any) => (<p {...props}/>),
    Text: (props: any) => (<p {...props}/>),
}));

jest.mock('../../button', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props}/>),
    Button: (props: any) => (<div {...props} />)
}));

import ChartFallback from './ChartFallback';

describe('<ChartFallback/>', () => {
    const defaultProps = {
        text: 'No data available'
    }

    const renderComponent = (props: any = {}) => {
        return render(<ChartFallback {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-chart-fallback')).toBeInTheDocument();
        const textComponent = screen.getByTestId('ds-chart-fallback-text');
        expect(textComponent).toBeInTheDocument();
        expect(textComponent).toHaveTextContent('No data available');
        expect(screen.queryByTestId('ds-chart-fallback-action')).not.toBeInTheDocument();
    });

    it('should render component with props action.', () => {
        renderComponent({ action: { children: 'action', onClick: jest.fn() } });
        expect(screen.getByTestId('ds-chart-fallback')).toBeInTheDocument();
        const textComponent = screen.getByTestId('ds-chart-fallback-text');
        expect(textComponent).toBeInTheDocument();
        expect(textComponent).toHaveTextContent('No data available');
        expect(screen.getByTestId('ds-chart-fallback-action')).toBeInTheDocument();
    });

    it('should render component with custom className.', () => {
        renderComponent({ className: 'my-custom-class' });
        const component = screen.getByTestId('ds-chart-fallback');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('my-custom-class');
    });

    it('should render component with custom data-testid.', () => {
        renderComponent({ 'data-testid': 'my-custom-data-testid' });
        expect(screen.getByTestId('my-custom-data-testid')).toBeInTheDocument();
    });
});