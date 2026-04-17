import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

const mockInitials = jest.fn((value: string) => value
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase());

jest.mock('@repo/services', () => ({
    initials: mockInitials,
}))

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../elements', () => ({
    Image: ({'data-testid': dataTestId = 'mock-image', ...props}: any) => {
        if(!props.src) {
            props.onError()
            return (
                <div data-testid={`${dataTestId}-fallback`}>
                    {props.fallback}
                </div>
            )
        }
        return (<img {...props} alt={props.alt} data-testid={dataTestId}/>)
    },
    Text: ({'data-testid': dataTestId = 'mock-image', ...props}: any) => (<p {...props} data-testid={dataTestId}/>),
}));

import Avatar from './Avatar';

describe('<Avatar/', () => {
    const defaultProps = {
        src: undefined,
        size: 'medium',
        name: 'Harry Potter Junior',
        context: 'primary',
        initialsLength: 3,
        hasNotification: false,
    }

    const renderComponent = (props: any = {}) => {
        return render(<Avatar {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.resetModules();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should renders component correctly.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-avatar')).toBeInTheDocument();
        expect(screen.getByTestId('ds-avatar-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('ds-avatar-image-fallback')).toBeInTheDocument();
    });

    it('should renders component with notification.', () => {
        renderComponent({ hasNotification: true });
        expect(screen.getByTestId('ds-avatar-notification')).toBeInTheDocument();
    });

    it('should renders component with title.', () => {
        renderComponent({ title: defaultProps.name });
        expect(screen.getByTestId('ds-avatar-title')).toBeInTheDocument();
    });

    it('should renders component with image correctly.', () => {
        renderComponent({ src: 'https://picsum.photos/200/300' });
        const dsAvatarImage = screen.getByTestId('ds-avatar-image');
        expect(dsAvatarImage).toBeInTheDocument();
        expect(dsAvatarImage).toHaveClass('ds-avatar__img--loaded');
    });
});