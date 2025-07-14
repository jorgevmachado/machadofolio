import * as React from 'react';

jest.mock('@repo/ds', () => {
    return {
        Link: (props: any) => React.createElement('a', { ...props, 'data-testid': 'mocked-ds-link' }),
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
    }
});