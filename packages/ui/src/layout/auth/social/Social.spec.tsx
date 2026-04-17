import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('@repo/ds', () => ({
    Button: (props: any) => (<button {...props}/>),
}));

import Social from './Social';

describe('<Social/>', () => {
    const defaultProps = {
        label: 'Sign in with Google',
        platform: 'google'
    };

    const renderComponent = (props: any = {}) => {
        return render(<Social {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with platform google', () => {
        renderComponent();
        const component = screen.getByTestId('ui-social-google');
        expect(component).toBeInTheDocument();
        expect(component.tagName).toBe('BUTTON');
        expect(component).toHaveClass('ui-social__google');
    });

    it('should render component with platform facebook with aria-label', () => {
        renderComponent({ label: 'Sign in with Facebook', platform: 'facebook', ariaLabel: 'Sign in with Facebook', });
        const component = screen.getByTestId('ui-social-facebook');
        expect(component).toBeInTheDocument();
        expect(component.tagName).toBe('BUTTON');
        expect(component).toHaveClass('ui-social__facebook');
    });

    it('should render component with platform github and onClick', () => {
        const mockOnClick = jest.fn();
        renderComponent({ label: 'Sign in with GitHub', platform: 'github', onClick: mockOnClick });
        const component = screen.getByTestId('ui-social-github');
        expect(component).toBeInTheDocument();
        expect(component.tagName).toBe('BUTTON');
        expect(component).toHaveClass('ui-social__github');
        fireEvent.click(component);
        expect(mockOnClick).toHaveBeenCalled();
    });
})