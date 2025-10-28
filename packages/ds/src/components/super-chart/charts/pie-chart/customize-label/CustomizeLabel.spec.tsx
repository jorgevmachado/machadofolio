import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

const mockConvertToNumber = jest.fn();
jest.mock('@repo/services', () => ({
    convertToNumber: mockConvertToNumber
}))


import CustomizeLabel from './CustomizeLabel';

describe('<CustomizeLabel/>', () => {
    const defaultProps = {
        cx: 250,
        cy: 250,
        percent: 0.3333333333333333,
        midAngle: 60,
        outerRadius: 196,
        innerRadius: 0,
        middleRadius: 98,
    }

    const renderComponent = (props: any = {}) => {
        return render(<CustomizeLabel {...defaultProps} {...props}/>)
    }

    beforeEach(() => {
        mockConvertToNumber.mockImplementation((value?: any, fallback: number = 0) => {
            if(!value) {
                return fallback;
            }
            const raw = Number(value);
            if(isNaN(raw)) {
                return fallback;
            }
            return raw;
        })
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent({ outerRadius: 0 });
        const componentText = screen.getByTestId('ds-pie-chart-customize-label-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveTextContent('33%');
        expect(componentText).toHaveAttribute('x', '250');
    });

    it('should render component with cx with fallback.', () => {
        renderComponent({ cx: {} });
        const componentText = screen.getByTestId('ds-pie-chart-customize-label-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveTextContent('33%');
        expect(componentText).toHaveAttribute('x', '49.000000000000014');
    });

    it('should render component textAnchor equal start.', () => {
        renderComponent({ innerRadius: 0 });
        const componentText = screen.getByTestId('ds-pie-chart-customize-label-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveTextContent('33%');
        expect(componentText).toHaveAttribute('x', '299');
    });
})