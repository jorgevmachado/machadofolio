import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import LabelListContent from './LabelListContent';

describe('<LabelListContent/>', () => {
    const defaultProps = {
        value: 'Page'
    }

    const renderComponent = (props: any = {}) => {
        render(<LabelListContent {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-bar-chart-label-list-content')).not.toBeInTheDocument();
    });

    it('should render component with undefined y.', () => {
        renderComponent({ x: 10 });
        expect(screen.queryByTestId('ds-bar-chart-label-list-content')).not.toBeInTheDocument();
    });

    it('should render component with undefined width.', () => {
        renderComponent({ x: 10, y: 20 });
        expect(screen.queryByTestId('ds-bar-chart-label-list-content')).not.toBeInTheDocument();
    });

    it('should render component without fillText.', () => {
        renderComponent({ x: 10, y: 20, width: '20', });
        expect(screen.getByTestId('ds-bar-chart-label-list-content')).toBeInTheDocument();
        expect(screen.getByTestId('ds-bar-chart-label-list-content-circle')).toBeInTheDocument();
        const textComponent = screen.getByTestId('ds-bar-chart-label-list-text');
        expect(textComponent).toBeInTheDocument();
        expect(textComponent).toHaveAttribute('fill', '#fff');
    });

    it('should render component with fillText.', () => {
        renderComponent({ x: 10, y: 20, width: '20', fillText: '#000' });
        expect(screen.getByTestId('ds-bar-chart-label-list-content')).toBeInTheDocument();
        expect(screen.getByTestId('ds-bar-chart-label-list-content-circle')).toBeInTheDocument();
        const textComponent = screen.getByTestId('ds-bar-chart-label-list-text');
        expect(textComponent).toBeInTheDocument();
        expect(textComponent).toHaveAttribute('fill', '#000');
    });
});