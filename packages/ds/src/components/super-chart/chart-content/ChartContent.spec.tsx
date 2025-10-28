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

jest.mock('../chart-wrapper', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-chart-wrapper"/>),
    ChartWrapper: (props: any) => (<div {...props} data-testid="mock-chart-wrapper"/>),
}));

import ChartContent from './ChartContent';

describe('<ChartContent/>', () => {
    const defaultProps = {
        title: 'title',
        children: 'children',
        fallback: 'fallback',
        isFallback: false,
    };

    const renderComponent = (props: any = {}) => {
        return render(<ChartContent {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('mock-chart-wrapper')).toBeInTheDocument();
        const textComponent = screen.getByTestId('ds-chart-content-title');
        expect(textComponent).toBeInTheDocument();
        expect(textComponent).toHaveTextContent('title');

        expect(screen.queryByTestId('ds-chart-content-fallback')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-chart-content-subtitle')).not.toBeInTheDocument();
    });

    it('should render component with fallback.', () => {
        renderComponent({ isFallback: true, className: 'custom-class' });
        expect(screen.getByTestId('ds-chart-content-fallback')).toBeInTheDocument();
        const fallbackText = screen.getByTestId('ds-chart-content-fallback-text');
        expect(fallbackText).toBeInTheDocument();
        expect(fallbackText).toHaveTextContent('fallback');
    });

    it('should render component with subtitle.', () => {
        renderComponent({ subtitle: 'subtitle' });
        const subtitleText = screen.getByTestId('ds-chart-content-subtitle');
        expect(subtitleText).toBeInTheDocument();
        expect(subtitleText).toHaveTextContent('subtitle');
    })

})