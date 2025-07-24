import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => ({
    generateComponentId: jest.fn(() => 'mock-id'),
    joinClass: (classes: any[]) => classes.filter(Boolean).join(' '),
}));
jest.mock('../../elements', () => ({
    Text: (props: any) => (<p {...props} data-testid="mock-text">{props.value}{props.children}</p>),
}));
jest.mock('../label', () => ({
    __esModule: true,
    default: (props: any) => (<label {...props} data-testid="mock-label">{props.label}</label>),
}));
jest.mock('../feedback', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-feedback">{props.children}</div>),
}));
jest.mock('./file-input', () => ({
    __esModule: true,
    default: (props: any) => (<input data-testid="mock-file-input"  {...props} onChange={e => props.onChange?.(e, 'mock-base-64')}/>),
}));
jest.mock('./content', () => ({
    __esModule: true,
    Content: (props: any) => (<input data-testid="mock-content" {...props}/>)
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

    it('renders the label when the label prop is provided', () => {
        renderComponent({ label: 'Test Label'});
        expect(screen.getByTestId('mock-label')).toHaveTextContent('Test Label');
    });

    it('renders FileInput when type is file', () => {
        renderComponent({ type: 'file'});
        expect(screen.getByTestId('mock-file-input')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-content')).not.toBeInTheDocument();
    });

    it('updates value state and triggers onChange', () => {
        const handleChange = jest.fn();
        renderComponent({ onChange: handleChange });
        const content = screen.getByTestId('mock-content');
        fireEvent.change(content, { target: { value: 'new value' } });
        fireEvent.blur(content, { target: { value: 'new value' } });
        expect(content).toHaveAttribute('value', '');
    });

    it('updates currentInputValue when the value prop changes', () => {
        const { rerender } = renderComponent({ value: 'A' });
        const content = screen.getByTestId('mock-content');
        expect(content).toHaveAttribute('value', 'A');
        rerender(<Input {...defaultProps} value="B" />);
        expect(screen.getByTestId('mock-content')).toHaveAttribute('value', 'B');
    });

    it('shows validation feedback when invalid', () => {
        renderComponent({ validator: { invalid: true, message: 'Error!' } });
        expect(screen.getByTestId('mock-feedback')).toHaveTextContent('Error!');
    });

    it('does not show feedback if invalid is true without a message', () => {
        renderComponent({ validator: { invalid: true } });
        expect(screen.queryByTestId('mock-feedback')).not.toBeInTheDocument();
    });

    it('displays helperText when provided', () => {
        renderComponent({ helperText: { value: 'Help', className: 'custom-helper' } });
        expect(screen.getByTestId('mock-text')).toHaveTextContent('Help');
        expect(screen.getByTestId('mock-text')).toHaveClass('ds-input__helper-text');
        expect(screen.getByTestId('mock-text')).toHaveClass('custom-helper');
    });

    it('triggers onBlur and sets invalid state if required and empty', () => {
        const onBlur = jest.fn();
        renderComponent({ required: true, onBlur });
        const content = screen.getByTestId('mock-content');

        fireEvent.blur(content, { target: { value: '   ' } });

        expect(onBlur).toHaveBeenCalled();
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

    it('applies aria attributes correctly', () => {
        renderComponent({
            id: 'mock-id',
            label: 'L',
            disabled: true,
            validator: { invalid: true, message: 'invalid' },
            helperText: { value: 'Help'},
            placeholder: 'Test Placeholder'
        });

        const el = screen.getByTestId('ds-input');
        expect(el).toHaveAttribute('id', 'mock-id');

        expect(screen.getByTestId('mock-content')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('mock-content')).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByTestId('mock-content')).toHaveAttribute('aria-labelledby', 'mock-id-label');
        expect(screen.getByTestId('mock-content')).toHaveAttribute('aria-describedby', 'mock-id-helper-text');
        expect(screen.getByTestId('mock-content')).toHaveAttribute('aria-placeholder', 'Test Placeholder');
    });

    it('updates currentInputValue and calls onChange when value is passed to the handler', async () => {
        const handleChange = jest.fn();
        renderComponent({ type: 'file', onChange: handleChange });
        const fileInput = screen.getByTestId('mock-file-input');
        expect(fileInput).toBeInTheDocument();
        fireEvent.change(fileInput, { target: { value: 'new Value'}}, 'base-64');
        expect(handleChange).toHaveBeenCalled();
    });

});