import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import Icon from './Icon';

jest.mock('./service', () => ({
    getIcon: jest.fn()
}));

import { getIcon } from './service';

describe('<Icon/>', () => {
    const defaultProps = {
        icon: 'react'
    }

    const renderComponent = (props: any = {}) => {
        render(<Icon {...defaultProps} {...props}/>);
    }

    beforeEach(() => {
        (getIcon as jest.Mock).mockReturnValue({ icon: (<div>test</div>), group: 'fa' });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component props default.', () => {
        renderComponent();
        const icon = screen.getByTestId('ds-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('ds-icon');
    });

    it('should render component with react componente in icon.', () => {
        renderComponent({ icon: (<div>test</div>)});
        const icon = screen.getByTestId('ds-icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render component with group icon.', () => {
        renderComponent({ icon: 'react', group: 'fa', withDefault: false });
        const icon = screen.getByTestId('ds-icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render component without default false and icon not found.', () => {
        renderComponent({ icon: 'soap', withDefault: false });
        const icon = screen.getByTestId('ds-icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render component with default true and icon not found.', () => {
        renderComponent({ icon: 'soap', withDefault: true });
        const icon = screen.getByTestId('ds-icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render component with other color.', () => {
        renderComponent({ color: 'info-40'});
        const icon = screen.getByTestId('ds-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('ds-color-info-40');
    });

});