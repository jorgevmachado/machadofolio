import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    Rectangle: (props: any) => (<div {...props} data-testid="mock-rectangle"></div>),
}));

import ActiveRectangle from './ActiveRectangle';

describe('<ActiveRectangle/>', () => {
    const defaultProps = {
        fill: '#fff',
        color: '#000',
        stroke: '#999'
    };

    const renderComponent = (props: any = {}) => {
        return render(<ActiveRectangle {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('mock-rectangle');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#000');
        expect(component).toHaveAttribute('stroke', '#999');
    });

    it('should render component without color and stroke', () => {
        renderComponent({ color: undefined, stroke: undefined });
        const component = screen.getByTestId('mock-rectangle');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#fff');
        expect(component).toHaveAttribute('stroke', '#fff');
    });


    it('should render component with activeBar', () => {
        renderComponent({ activeBar: { fill: '#BCBCBC', stroke: '#EDEDED'} });
        const component = screen.getByTestId('mock-rectangle');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('fill', '#BCBCBC');
        expect(component).toHaveAttribute('stroke', '#EDEDED');
    });
})