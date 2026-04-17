import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    currencyFormatter: (value: string | number) => `$${value}`,
}));

jest.mock('../../../../../elements', () => ({
    Text: (props: any) => (<p {...props} />),
}));

import TextTooltip from './TextTooltip';

describe('<TextTooltip />', () => {

    const defaultProps = {
        type: 'default',
        text: 'Revenue',
        dataName: 1000,
    };
    const renderComponent = (props: any = {}) => {
        return render(<TextTooltip {...defaultProps} {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render TextTooltip with text and appendText.', () => {
        renderComponent({ appendText: 'USD' });
        const tooltip = screen.getByTestId('ds-chart-content-tooltip-default');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Revenue: 1000 USD');
    });

    it('should render TextTooltip with text without appendText.', () => {
        renderComponent({ type: 'no-append-text' });
        const tooltip = screen.getByTestId('ds-chart-content-tooltip-no-append-text');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Revenue: 1000');
    });

    it('should render TextTooltip without text with appendText.', () => {
        renderComponent({ type: 'no-text', text: undefined, appendText: 'USD' });
        const tooltip = screen.getByTestId('ds-chart-content-tooltip-no-text');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('1000 USD');
    });

    it('should render TextTooltip with currency formatter and text and append text', () => {
        renderComponent({ type: 'revenue', appendText: 'USD', withCurrencyFormatter: true });
        const tooltip = screen.getByTestId('ds-chart-content-tooltip-revenue');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Revenue: $1000 USD');
    });

    it('should render TextTooltip without text and appendText.', () => {
        renderComponent({ type: 'only-value', text: undefined, appendText: undefined });
        const tooltip = screen.getByTestId('ds-chart-content-tooltip-only-value');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('1000');
    });
});