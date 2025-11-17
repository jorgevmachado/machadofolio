import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    currencyFormatter: (value: string | number) => `$${value}`,
}));

jest.mock('../../../../../elements', () => ({
    Text: (props: any) => (<p {...props} />),
}));

const mockPayloadItemSubLevel =  {
    name: 'sub-level',
    value: 2000,
}

const mockPayloadItem = {
    name: 'test',
    value: 3000,
    payload: mockPayloadItemSubLevel
}

jest.mock('./generic-custom-text', () => ({
    __esModule: true,
    default: ({ genericProps, ...props}: any) => {
        const result = {
            name: mockPayloadItem?.name
        }
        if(genericProps?.withSubLevel) {
            result.name = mockPayloadItemSubLevel?.name;
        }
        return (<p {...props}>{result.name}</p>)
    },
    GenericCustomText: ({ genericProps, ...props}: any) => {
        const result = {
            name: mockPayloadItem?.name
        }
        if(genericProps?.withSubLevel) {
            result.name = mockPayloadItemSubLevel?.name;
        }
        return (<p {...props}>{result.name}</p>)
    }
}));

import GenericContentTooltip from './GenericContentTooltip'


describe('<GenericContentTooltip/>', () => {

    const defaultProps = {
        data: {
            nub: 500,
            str: 'example'
        },
        payload: [mockPayloadItem],
        genericProps: {
            show: true
        }
    };

    const renderComponent = (props: any = {}) => {
        return render(<GenericContentTooltip {...defaultProps} {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-generic-content-tooltip-custom')).toBeInTheDocument();

        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('test');
    });

    it('should render component with custom props genericProps withSubLevel equal true.', () => {
        renderComponent({ genericProps: { withSubLevel: true } });
        expect(screen.getByTestId('ds-generic-content-tooltip-custom')).toBeInTheDocument();

        const text = screen.getByTestId('ds-generic-content-tooltip-custom-item-0');
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('sub-level');
    });

    it('should render component with default.', () => {
        renderComponent({ genericProps: { withName: false, withValue: false } });
        expect(screen.queryByTestId('ds-generic-content-tooltip-custom')).not.toBeInTheDocument();

        const text1 = screen.getByTestId('ds-generic-content-tooltip-default-item-0');
        expect(text1).toBeInTheDocument();
        expect(text1).toHaveTextContent('nub: 500');

        const text2 = screen.getByTestId('ds-generic-content-tooltip-default-item-1');
        expect(text2).toBeInTheDocument();
        expect(text2).toHaveTextContent('str: example');
    });

    it('should render component with default props and withCurrencyFormatter .', () => {
        renderComponent({ genericProps: { withName: false, withValue: false, withCurrencyFormatter: true } });
        expect(screen.queryByTestId('ds-generic-content-tooltip-custom')).not.toBeInTheDocument();

        const text1 = screen.getByTestId('ds-generic-content-tooltip-default-item-0');
        expect(text1).toBeInTheDocument();
        expect(text1).toHaveTextContent('nub: $500');

        const text2 = screen.getByTestId('ds-generic-content-tooltip-default-item-1');
        expect(text2).toBeInTheDocument();
        expect(text2).toHaveTextContent('str: $example');
    });

});