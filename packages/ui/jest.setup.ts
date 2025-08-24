import * as React from 'react';
import { jest } from '@jest/globals';

const useBreakpointMock = jest.fn() as jest.MockedFunction<() => { isMobile: boolean }>;

jest.mock('@repo/ds', () => {
    const originalModule = jest.requireActual('@repo/ds') as Record<string, any>;
    return {
        ...originalModule,
        Icon: ({ 'data-testid': dataTestId = 'mocked-ds-icon', ...props}: any) => React.createElement('span', { ...props, 'data-testid': dataTestId }),
        Link: ({ 'data-testid': dataTestId = 'mocked-ds-link', ...props}: any) => React.createElement('a', { ...props, 'data-testid': dataTestId }),
        Text: ({ 'data-testid': dataTestId = 'mocked-ds-text', ...props}: any) => React.createElement(props?.tag ?? 'p', { ...props, 'data-testid': dataTestId }),
        Image: ({ 'data-testid': dataTestId = 'mocked-ds-image', ...props}: any) => React.createElement('img', { ...props, 'data-testid': dataTestId }),
        Input: ({ 'data-testid': dataTestId = 'mocked-ds-input', ...props}: any) => {
            if(props.validator) {
                props.validator({ value: 'test@example.com'});
            }

            const { type, value, ...rest } = props;
            const inputProps = type === 'file' ? rest : props;

            return React.createElement('input', { ...inputProps, 'data-testid': dataTestId })
        },
        Alert: ({ 'data-testid': dataTestId = 'mocked-ds-alert', ...props}: any) => {
            return React.createElement(
                'div',
                { ...props, 'data-testid': dataTestId },
                props?.children && React.createElement(
                    'div',
                    { ...props, children: props.children, 'data-testid': 'mocked-ds-alert-content' },
                    props.children,
                    props?.link && React.createElement('span', { label: props.link.label,  onClick: props.link.onClick, 'data-testid': 'mocked-ds-alert-link' }),
                ),
                props?.onClose && React.createElement('span', { onClick: props.onClose, 'data-testid': 'mocked-ds-alert-icon-close' }),
            )
        },
        Button: ({ 'data-testid': dataTestId = 'mocked-ds-button', ...props}: any) => React.createElement('button', { ...props, 'data-testid': dataTestId }),
        Dropdown: ({ 'data-testid': dataTestId = 'mocked-ds-dropdown', ...props}: any) => {
            const [isOpen, setIsOpen ] = React.useState(false)
            const onClick = () => {
                setIsOpen(!isOpen);
            }
            return React.createElement(
                'div',
                { ...props, onClick, 'data-testid': dataTestId },
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
