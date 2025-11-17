import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    convertToNumber: (value: unknown) => Number(value),
    getPercentValue: () => '45%',
}));

jest.mock('../../../../../../elements', () => ({
    Text: (props: any) => (<p {...props} />),
}));

import GenericCustomText from './GenericCustomText';

describe('<GenericCustomText />', () => {

    const defaultProps = {
        total: 6608,
        payload: {
            name: 'test',
            value: 3000
        },
        genericProps: {
            show: true,
            withName: undefined,
            withValue: true,
            withTotalPercent: true,
        },
        'data-testid': 'ds-generic-content-tooltip-custom-item-0'
    }

    const renderComponent = (props: any = {}) => {
        return render(<GenericCustomText {...defaultProps} {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('test: 3000 (45%)');
    });

    it('should render component with props genericProps withValue equal false.', () => {
        renderComponent({ genericProps: {...defaultProps.genericProps, withValue: false } });
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('test');
    });

    it('should render component with props genericProps withName equal false.', () => {
        renderComponent({ genericProps: {...defaultProps.genericProps, withName: false, withTotalPercent: false } });
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('3000');
    });

    it('should render component with props genericProps withName and withValue equal false.', () => {
        renderComponent({ genericProps: {...defaultProps.genericProps, withName: false, withValue: false } });
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('');
    });

    it('should render component with props payload with value string.', () => {
        renderComponent({
            payload: {...defaultProps.payload, value: '5000' },
            genericProps: {...defaultProps.genericProps, withName: false }
        });
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('5000');
    });

    it('should render component with props payload with value undefined.', () => {
        renderComponent({
            payload: {...defaultProps.payload, value: undefined },
            genericProps: {...defaultProps.genericProps, withName: false }
        });
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('');
    });

    it('should render component with props payload with color.', () => {
        renderComponent({
            payload: {...defaultProps.payload, color: '#8884d8' },
            genericProps: {...defaultProps.genericProps, withName: false }
        });
        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('3000');
        expect(text).toHaveStyle('color: #8884d8');
    });
});