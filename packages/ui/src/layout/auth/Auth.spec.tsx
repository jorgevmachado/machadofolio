import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../components', () => {
    return {
        Logo: (props: any) => <div data-testid="mocked-ui-logo" {...props}/>,
        Form: (props: any) => <form data-testid="mocked-ui-form" {...props}/>,
    }
});

jest.mock('./social', () => ({
    __esModule: true,
    default: ({platform, ...props}: any) => <button {...props} data-testid={`ui-social-${platform}`}/>,
}));

import Auth from './Auth';

describe('<Auth/>', () => {
    const defaultProps = {
        type: 'blank'
    };

    const renderComponent = (props: any = {}) => {
        return render(<Auth {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
    });

    it('should render component with logo.', () => {
        renderComponent({ type: 'sign-in', logo: { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s'}});
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        expect(screen.getByTestId('mocked-ui-logo')).toBeInTheDocument();
    });

    it('should render component with title.', () => {
        renderComponent({ type: 'sign-in', title: 'Sign in'});
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        const text = screen.getByTestId('ui-auth-title');
        expect(text).toBeInTheDocument();
        expect(text.textContent).toBe('Sign in');
    });

    it('should render component with description.', () => {
        renderComponent({ type: 'sign-in', description: 'By creating an account, you agree to our Terms of Service and Privacy Policy.'});
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        const text = screen.getByTestId('ui-auth-description');
        expect(text).toBeInTheDocument();
        expect(text.textContent).toBe('By creating an account, you agree to our Terms of Service and Privacy Policy.');
    });

    it('should render component with SocialMedia.', () => {
        const socialMedia = [
            {
                label: 'Sign in with Google',
                platform: 'google',
            },
            {
                label: 'Sign in with GitHub',
                platform: 'github',
            },
            {
                label: 'Sign in with Facebook',
                platform: 'facebook',
            }
        ];
        renderComponent({ type: 'sign-in', socialMedia });
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        expect(screen.getByTestId('ui-auth-social-media')).toBeInTheDocument();
        expect(screen.getByTestId('ui-social-google')).toBeInTheDocument();
        expect(screen.getByTestId('ui-social-facebook')).toBeInTheDocument();
        expect(screen.getByTestId('ui-social-github')).toBeInTheDocument();
    });

    it('should render component with infoText.', () => {
        renderComponent({ type: 'sign-in', infoText: 'Or register with your email'});
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        const textInfo = screen.getByTestId('ui-auth-info-text');
        expect(textInfo).toBeInTheDocument();
        const text = screen.getByTestId('ui-auth-info-text-content');
        expect(text).toBeInTheDocument();
        expect(text.textContent).toBe('Or register with your email');
    });

    it('should render component with links.', () => {
        const links = [
            {
                order: 3,
                children: 'I forgot my password',
                context: 'primary',
            },
            {
                order: 2,
                title: 'Already have an account ?',
                children: 'Sign in here',
                context: 'primary',
            },
            {
                order: 1,
                title: 'Don\'t have an account ?',
                children: 'Register here',
                context: 'primary',
            }
        ];
        renderComponent({ type: 'sign-in', links});
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        expect(screen.getByTestId('ui-auth-links')).toBeInTheDocument();
        expect(screen.getByTestId('ui-auth-link-1')).toBeInTheDocument();
        expect(screen.getByTestId('ui-auth-link-2')).toBeInTheDocument();
        expect(screen.getByTestId('ui-auth-link-3')).toBeInTheDocument();
    });

    it('should render component with links and default context.', () => {
        const links = [
            {
                order: 3,
                children: 'I forgot my password',
            },
            {
                order: 2,
                title: 'Already have an account ?',
                children: 'Sign in here',
            },
            {
                order: 1,
                title: 'Don\'t have an account ?',
                children: 'Register here',
            }
        ];
        renderComponent({ type: 'sign-in', links});
        const component = screen.getByTestId('ui-auth');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-auth');
        expect(screen.getByTestId('ui-auth-links')).toBeInTheDocument();
        expect(screen.getByTestId('ui-auth-link-1')).toBeInTheDocument();
        expect(screen.getByTestId('ui-auth-link-2')).toBeInTheDocument();
        expect(screen.getByTestId('ui-auth-link-3')).toBeInTheDocument();
    });

});