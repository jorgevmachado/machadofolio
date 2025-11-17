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

jest.mock('../../card', () => ({
    __esModule: true,
    default: ({ children, ...props}: any) => (<div {...props}>{children}</div>),
    Card: ({ children, ...props}: any) => (<div {...props}>{children}</div>),
}));

import ChartContainer from './ChartContainer';

describe('<ChartContent/>', () => {
    const defaultProps = {
        title: 'title',
        children: 'children',
        fallback: 'fallback',
        isFallback: false,
    };

    const renderComponent = (props: any = {}) => {
        return render(<ChartContainer {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-chart-container-default')).toBeInTheDocument();
        const textComponent = screen.getByTestId('ds-chart-container-title');
        expect(textComponent).toBeInTheDocument();
        expect(textComponent).toHaveTextContent('title');

        expect(screen.queryByTestId('ds-chart-container-fallback')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-chart-container-subtitle')).not.toBeInTheDocument();
    });

    it('should render component with fallback.', () => {
        renderComponent({ isFallback: true, className: 'custom-class' });
        expect(screen.getByTestId('ds-chart-container-fallback')).toBeInTheDocument();
        const fallbackText = screen.getByTestId('ds-chart-container-fallback-text');
        expect(fallbackText).toBeInTheDocument();
        expect(fallbackText).toHaveTextContent('fallback');
    });

    it('should render component with subtitle.', () => {
        renderComponent({ subtitle: 'subtitle' });
        const subtitleText = screen.getByTestId('ds-chart-container-subtitle');
        expect(subtitleText).toBeInTheDocument();
        expect(subtitleText).toHaveTextContent('subtitle');
    });

    it('should render component with type card.', () => {
        renderComponent({ wrapperType: 'card'});
        expect(screen.getByTestId('ds-chart-container-card')).toBeInTheDocument();
    })

})