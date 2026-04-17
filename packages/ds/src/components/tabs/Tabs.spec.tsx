import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

import Tabs from './Tabs';

describe('<Tabs/>', () => {
    const mockItems = [
        {
            title: 'Tab 1',
            children: 'Tab 1 Content',
        },
        {
            title: 'Tab 2',
            children: 'Tab 2 Content',
        },
        {
            title: 'Tab 3',
            children: 'Tab 3 Content',
        },
    ]

    const defaultProps = {
        fluid: false,
        items: mockItems,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Tabs {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-tabs');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-tabs');
    });

    it('should render component with fluid true.', () => {
        renderComponent({ fluid: true });
        const component = screen.getByTestId('ds-tabs');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-tabs__fluid');
    });

    it('should click in tab and change tab', () => {
        renderComponent({ fluid: true });
        const active1 = screen.getByTestId('ds-tabs-content-0');
        expect(active1).toBeInTheDocument();

        const tab2 = screen.getByTestId('ds-tabs-item-1');
        fireEvent.click(tab2);

        const active2 = screen.getByTestId('ds-tabs-content-1');
        expect(active2).toBeInTheDocument();


    });
});