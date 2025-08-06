import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import Logo from './Logo';

describe('<Logo/>', () => {
    const defaultProps = {};

    const renderComponent = (props: any = {}) => {
        return render(<Logo {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-logo');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-logo');
        const image = screen.getByTestId('mocked-ds-image')
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://placehold.co/150');
    });

    it('should render component with custom props.', () => {
        renderComponent({ src: 'https://placehold.co/100', alt: 'custom-alt'});
        const component = screen.getByTestId('ui-logo');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-logo');
        const image = screen.getByTestId('mocked-ds-image')
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://placehold.co/100');
        expect(image).toHaveAttribute('alt', 'custom-alt');
    });
});