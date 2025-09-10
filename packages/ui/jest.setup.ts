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
        Input: ({ 'data-testid': dataTestId = 'mocked-ds-input', ...props }: any) => {
            if(props.validator) {
                props.validator({ value: 'test@example.com'});
            }
            const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
                if (props.onInput) {
                    props.onInput({
                        name: event.currentTarget.name,
                        value: event.currentTarget.value,
                        event,
                        invalid: false
                    });
                }
                if (props.onChange) {
                    props.onChange(event);
                }
            };
            const { type, value, ...rest } = props;
            const inputProps = type === 'file' ? rest : props;
            return React.createElement('input', {
                ...inputProps,
                'data-testid': dataTestId,
                onInput: handleInput,
                onChange: handleInput,
                value: props.value ?? '',
                name: props.name
            });
        },
        Alert: ({ 'data-testid': dataTestId = 'mocked-ds-alert', ...props}: any) => React.createElement(
            'div',
            { ...props, 'data-testid': dataTestId },
            props?.children && React.createElement(
                'div',
                { ...props, children: props.children, 'data-testid': 'mocked-ds-alert-content' },
                props.children,
                props?.link && React.createElement('span', { label: props.link.label,  onClick: props.link.onClick, 'data-testid': 'mocked-ds-alert-link' }),
            ),
            props?.onClose && React.createElement('span', { onClick: props.onClose, 'data-testid': 'mocked-ds-alert-icon-close' }),
        ),
        Modal: ({ 'data-testid': dataTestId = 'mocked-ds-modal', ...props}: any) => React.createElement(
            'div',
            props,
            React.createElement('div', { onClick: () => props?.closeOnOutsideClick && props?.onClose, 'data-testid': `${dataTestId}-backdrop`}),
            React.createElement('div', {
                role: 'dialog',
                style: { width: props?.width, maxHeight: props?.maxHeight},
                'data-testid': dataTestId
            },
                React.createElement('div', {
                    'data-testid': `${dataTestId}-header`
                },
                    React.createElement('div', { 'data-testid': `${dataTestId}-header-side`}),
                    props?.title && React.createElement('h2', { 'data-testid': `${dataTestId}-title`}),
                    React.createElement('button', { 'data-testid': `${dataTestId}-close`, onClick: props?.onClose},
                        props?.customCloseIcon && props.customCloseIcon,
                        !props?.customCloseIcon && React.createElement('span', { 'data-testid': `${dataTestId}-close-icon`})
                    ),
                ),
                React.createElement('div', { 'data-testid': `${dataTestId}-children` }, props?.children),
            ),
        ),
        Button: ({ 'data-testid': dataTestId = 'mocked-ds-button', ...props}: any) => React.createElement('button', { ...props, 'data-testid': dataTestId }),
        Spinner: ({ 'data-testid': dataTestId = 'mocked-ds-spinner', ...props}: any) => React.createElement(
            'div',
            { ...props, 'data-testid': dataTestId },
            React.createElement('div', { ...props, 'data-testid': `${dataTestId}-${props.type ?? 'circle'}` })
        ),
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