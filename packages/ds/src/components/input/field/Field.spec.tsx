import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../../elements', () => ({
    Text: (props: any) => (<p {...props} data-testid="mock-text" />),
    Icon: (props: any) => (<span {...props} data-testid="mock-icon" />),
}));

jest.mock('../../../utils', () => {
    const realUtils = jest.requireActual('../../../utils');
    return {
        ...realUtils,
        useChildrenElements: (children: any) => {
            const mapping: Record<string, React.ReactNode> = {};
            React.Children.forEach(children, (child: any) => {
                if (child && child.props && child.props['data-type']) {
                    mapping[child.props['data-type']] = child;
                }
            });
            return {
                childrenElements: mapping,
                getChildrenElement: (type: string) => mapping[type] || null,
            };
        },
        joinClass: (classes: any[]) => classes.filter(Boolean).join(' '),
    }
});

import Field from './Field';

const createChild = (dataType: string, label?: string) => (
    <div data-type={dataType} data-testid={dataType + '-child'}>
        {label || dataType}
    </div>
);


describe('<Content/>', () => {
    const defaultProps = {
        type: 'text',
        placeholder: 'placeholder',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Field {...defaultProps} {...props}/>);
    }
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Should render component with default props', () => {
        renderComponent();
        const component = screen.getByTestId('ds-input-content')
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-input-content');
    });

    it('Should render addon text when prop is passed', () => {
        renderComponent({
            addon: { value: 'addon value', 'data-testid': 'addon-prop' }
        });
        expect(screen.getByTestId('mock-text')).toBeInTheDocument();
        expect(screen.getByText('addon value')).toBeInTheDocument();
    });

    it('Should render addon as children when no prop is set', () => {
        renderComponent({
            children: createChild('addon', 'addonChild'),
        });
        expect(screen.getByTestId('addon-child')).toBeInTheDocument();
        expect(screen.getByText('addonChild')).toBeInTheDocument();
    });

    it('Should render counter prop if provided', () => {
        renderComponent({
            counter: { value: 123, 'data-testid': 'counter-prop' }
        });
        expect(screen.getByTestId('mock-text')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('Should render counter as children if no prop provided', () => {
        renderComponent({
            children: createChild('counter', 'counterChild'),
        });
        expect(screen.getByTestId('counter-child')).toBeInTheDocument();
        expect(screen.getByText('counterChild')).toBeInTheDocument();
    });

    it('Should render prepend children', () => {
        renderComponent({
            children: createChild('prepend', 'PRE')
        });
        expect(screen.getByTestId('prepend-child')).toBeInTheDocument();
        expect(screen.getByText('PRE')).toBeInTheDocument();
    });

    it('Should render append children', () => {
        renderComponent({
            children: createChild('append', 'APP')
        });
        expect(screen.getByTestId('append-child')).toBeInTheDocument();
        expect(screen.getByText('APP')).toBeInTheDocument();
    });

    it('Should render icon left/right with IconProps', () => {
        renderComponent({
            icon: { icon: 'react', position: 'left' }
        });
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('Should render icon left child when no icon prop', () => {
        renderComponent({
            children: createChild('icon-left', 'ABCD')
        });
        expect(screen.getByTestId('icon-left-child')).toBeInTheDocument();
        expect(screen.getByText('ABCD')).toBeInTheDocument();
    });

    it('Should render icon right with position right', () => {
        renderComponent({
            icon: { icon: 'bolt', position: 'right' }
        });
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('Should render icon right child when no icon prop position right', () => {
        renderComponent({
            children: createChild('icon-right', 'RIGHTICON')
        });
        expect(screen.getByTestId('icon-right-child')).toBeInTheDocument();
        expect(screen.getByText('RIGHTICON')).toBeInTheDocument();
    });

    it('Should render as textarea if type is textarea', () => {
        renderComponent({ type: 'textarea', rows: 4 });
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('Should pass rows to textarea and not input', () => {
        renderComponent({ type: 'textarea', rows: 7 });
        const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(ta).toHaveAttribute('rows', '7');
    });

    it('Should render as input if type is not textarea', () => {
        renderComponent({ type: 'email' });
        expect(screen.getByRole('textbox')).not.toBeNull();
    });

    it('Should include disabled class if disabled', () => {
        renderComponent({ disabled: true });
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveClass('ds-input-content__field--disabled');
        expect(input).toBeDisabled();
    });

    it('Should include error class if isInvalid', () => {
        renderComponent({ isInvalid: true });
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveClass('ds-input-content__field--error');
    });

    it('Should toggle password visibility on icon click', () => {
        renderComponent({ type: 'password' });

        const iconElem = screen.getByTestId('mock-icon');
        expect(iconElem).toBeInTheDocument();

        fireEvent.click(iconElem);

        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveAttribute('type', 'text');

        fireEvent.click(iconElem);
    });

    it('Should use all prop className to input', () => {
        renderComponent({ className: 'my-class' });
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('my-class')
    });

    it('Should support fluid class and custom props', () => {
        renderComponent({ fluid: true, 'data-any': 'xxx' });
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveClass('ds-input-content__field--fluid');
        expect(input).toHaveAttribute('data-any', 'xxx');
    });

    it('Should call ref correctly for input', () => {
        const inputRef = React.createRef<HTMLInputElement>();
        render(<Field {...defaultProps} ref={inputRef} />);
        expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    });

    it('Should call ref correctly for textarea', () => {
        const taRef = React.createRef<HTMLTextAreaElement>();
        render(<Field {...defaultProps} type="textarea" ref={taRef} />);
        expect(taRef.current).toBeInstanceOf(HTMLTextAreaElement);
    });
});