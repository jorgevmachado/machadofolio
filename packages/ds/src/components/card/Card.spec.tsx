import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';
import Card from './Card';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
        generateComponentId: jest.fn(() => 'mock-id'),
    }
});

describe('<Card/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const defaultProps = {
        children: 'children'
    }

    const renderComponent = (props: any = {}) => {
        return render(<Card {...defaultProps} {...props}/>);
    }

    it('should render component with default props', () => {
        renderComponent();
        const component = screen.getByTestId('ds-card');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-card');
    });

    it('should render component with id', () => {
        renderComponent({id: 'custom-id'});
        const component = screen.getByTestId('ds-card');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-card');
        expect(component).toHaveAttribute('id', 'custom-id');
    });

    it('should render component with custom className', () => {
        renderComponent({className: 'custom-class-name'});
        const component = screen.getByTestId('ds-card');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-card custom-class-name');
    });
});