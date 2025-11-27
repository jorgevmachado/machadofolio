import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

const mockConvertToNumber = jest.fn();
jest.mock('@repo/services', () => ({
    convertToNumber: mockConvertToNumber
}))

import PieNeedle from './PieNeedle';

describe('<PieNeedle/>', () => {
    const defaultProps = {
        cx: 100,
        cy: 100,
        iR: 50,
        oR: 100,
        data: [
            { fill: '#ff0000', name: 'A', value: 80  },
            { fill: '#00ff00', name: 'B', value: 45 },
            { fill: '#FFBB28', name: 'C', value: 25 },
        ],
        value: 50,
        color: '#d0d000',
    };

    const renderComponent = (props: any = {}) => {
        return render(<PieNeedle {...defaultProps} {...props}/>)
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
        renderComponent();
        const componentCircle = screen.getByTestId('ds-pie-chart-needle-circle');
        expect(componentCircle).toBeInTheDocument();
        expect(componentCircle).toHaveAttribute('fill', '#d0d000');
        const componentPath = screen.getByTestId('ds-pie-chart-needle-path');
        expect(componentPath).toBeInTheDocument();
        expect(componentPath).toHaveAttribute('fill', '#d0d000');
    });
})