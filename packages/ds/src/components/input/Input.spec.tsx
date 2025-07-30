import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => ({
    generateComponentId: jest.fn(() => 'mock-id'),
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));
jest.mock('../../elements', () => ({
    Text: (props: any) => (<p {...props} data-testid="mock-text">{props.children}</p>),
}));
jest.mock('../label', () => ({
    __esModule: true,
    default: (props: any) => (<label {...props} data-testid="mock-label">{props.label}</label>),
}));
jest.mock('../feedback', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-feedback">{props.children}</div>),
}));
jest.mock('./content', () => ({
    __esModule: true,
    default: (props: any) => (<input data-testid="mock-content" {...props}/>)
}));
jest.mock('./InputContext', () => ({
    __esModule: true,
    InputProvider: ({ children }: any) => <div data-testid="mock-input-provider">{children}</div>,
}));


import Input from './Input';

describe('<Input/>', () => {
    const defaultProps = {
        type: 'text',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Input {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with default props.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-input');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-input');
        expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });

    it('should renders the label when the label prop is provided', () => {
        renderComponent({ label: 'Test Label'});
        expect(screen.getByTestId('mock-label')).toHaveTextContent('Test Label');
    });

    it('should renders the helperText when the helperText prop is provided', () => {
        renderComponent({ helperText: { color: 'info-80', children: 'Test Helper Text', className: 'custom-helper' }});
        expect(screen.getByTestId('mock-text')).toHaveTextContent('Test Helper Text');
        expect(screen.getByTestId('mock-text')).toHaveClass('ds-input__helper-text');
        expect(screen.getByTestId('mock-text')).toHaveClass('custom-helper');
    });

    it('shows validation feedback when invalid', () => {
        renderComponent({ validator: { invalid: true, message: 'Error!' } });
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Error!');
    });

    it('does not show feedback if invalid is true without a message', () => {
        renderComponent({ validator: { invalid: true } });
        expect(screen.queryByTestId('mock-feedback')).not.toBeInTheDocument();
    });

    it('should render label, HelperText and Feedback with validator invalid and message', () => {
        renderComponent({
                label: 'Test Label',
                validator: { invalid: true, message: 'Invalid' },
                helperText: { children: 'Test Helper Text' }
        });
        expect(screen.getByTestId('mock-label')).toHaveTextContent('Test Label');
        expect(screen.getByTestId('mock-text')).toHaveTextContent('Test Helper Text');
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Invalid');

    });

    it('onInput, onFocus, onChange, onKeyDown, and onMouseDown events are fired', () => {
        const handlers = {
            onInput: jest.fn(),
            onFocus: jest.fn(),
            onChange: jest.fn(),
            onKeyDown: jest.fn(),
            onMouseDown: jest.fn(),
        }
        renderComponent({ ...handlers });
        const content = screen.getByTestId('mock-content');
        fireEvent.focus(content);
        fireEvent.input(content);
        fireEvent.change(content, { target: { value: 'abc' }});
        fireEvent.keyDown(content, { key: 'A' });
        fireEvent.mouseDown(content);

        expect(handlers.onFocus).toHaveBeenCalled();
        expect(handlers.onInput).toHaveBeenCalled();
        expect(handlers.onChange).toHaveBeenCalled();
        expect(handlers.onKeyDown).toHaveBeenCalled();
        expect(handlers.onMouseDown).toHaveBeenCalled();
    });

    it('updates value state and triggers onChange', () => {
        const handleChange = jest.fn();
        renderComponent({ onChange: handleChange });
        const content = screen.getByTestId('mock-content');
        fireEvent.change(content, { target: { value: 'new value' } });
        fireEvent.blur(content, { target: { value: 'new value' } });
        expect(content).toHaveAttribute('value', '');
    });

    it('triggers onBlur and sets invalid state if required and empty', () => {
        const onBlur = jest.fn();
        renderComponent({ required: true, onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value: '   ' } });

        expect(onBlur).toHaveBeenCalled();
    });

});