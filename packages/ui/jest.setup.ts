import * as React from 'react';
import { jest } from '@jest/globals';

const useBreakpointMock = jest.fn() as jest.MockedFunction<() => { isMobile: boolean }>;

jest.mock('@repo/ds', () => {
    const originalModule = jest.requireActual('@repo/ds') as Record<string, any>;
    return {
        ...originalModule,
        Icon: (props: any) => React.createElement('span', { ...props, 'data-testid': 'mocked-ds-icon' }),
        Link: (props: any) => React.createElement('a', { ...props, 'data-testid': 'mocked-ds-link' }),
        Text: (props: any) => React.createElement('h1', { ...props, 'data-testid': 'mocked-ds-text' }),
        Image: (props: any) => React.createElement('img', { ...props, 'data-testid': 'mocked-ds-image' }),
        Button: (props: any) => React.createElement('button', { ...props, 'data-testid': 'mocked-ds-button' }),
        Dropdown: (props: any) => {
            const [isOpen, setIsOpen ] = React.useState(false)
            const onClick = () => {
                setIsOpen(!isOpen);
            }
            return React.createElement(
                'div',
                { ...props, onClick, 'data-testid': 'mocked-ds-dropdown' },
                props?.activator
                    ? props?.activator
                    : React.createElement('div', { ...props }, props?.type === 'button'
                        ? React.createElement('button', { label: props?.label, 'data-testid': 'mocked-ds-button'}, props?.label)
                        : React.createElement('a', { label: props?.label, 'data-testid': 'mocked-ds-link'}, props.label)
                    ),
                isOpen && props?.children,
            )
        },
        useBreakpoint: useBreakpointMock,
    }
});

(global as any).useBreakpointMock = useBreakpointMock;
