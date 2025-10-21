import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react';

const mockIsReactNode = jest.fn();
const mockFormattedText = jest.fn();
const mockTranslateValue = jest.fn();
jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
        isReactNode: mockIsReactNode,
        formattedText: mockFormattedText,
        translateValue: mockTranslateValue,
        generateComponentId: jest.fn(() => 'mock-id'),
    }
});

import { formattedText, isReactNode, translateValue } from '../../utils';

import Text from './Text';
import { TranslatorFunction } from '@repo/i18n';

describe('<Text/>', () => {
    const defaultProps = {
        children: 'Hello World!'
    };

    const renderComponent = (props: any = {}) => {
        return render(<Text {...defaultProps} {...props}/>);
    }

    beforeEach(() => {
        (formattedText as jest.Mock).mockImplementation((text: string) => text)
        (isReactNode as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with default props.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-text');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-text');
        expect(component.tagName.toLowerCase()).toBe('p');
    });

    it('should render component with id.', () => {
        renderComponent({ id: 'custom-id' });
        const component = screen.getByTestId('ds-text');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('id', 'custom-id');
        expect(component).toHaveClass('ds-text');
        expect(component.tagName.toLowerCase()).toBe('p');
    });

    it('should render with a custom tag', () => {
        renderComponent({ tag: 'span', children: 'Custom Tag' });
        const component = screen.getByTestId('ds-text');
        expect(component.tagName.toLowerCase()).toBe('span');
    });

    it('should add htmlFor when tag is label', () => {
        renderComponent({ tag: 'label', htmlFor: 'my-input', children: 'Label' });
        const component = screen.getByTestId('ds-text');
        expect(component.tagName.toLowerCase()).toBe('label');
        expect(component.getAttribute('for')).toBe('my-input');
    });

    it('should apply color class when color provided', () => {
        renderComponent({ color: 'info-40', children: 'Colored Text' });
        expect(screen.getByText('Colored Text')).toHaveClass('ds-color-info-40');
    });

    it('should apply weight and variant classes', () => {
        renderComponent({ weight: 'bold', variant: 'caption', children: 'Styled Text' });
        const component = screen.getByText('Styled Text');
        expect(component).toHaveClass('ds-text__weight--bold');
        expect(component).toHaveClass('ds-text__variant--caption');
    });

    it('should append additional className', () => {
        renderComponent({ className: 'extra-class', children: 'With Extra Class' });
        expect(screen.getByText('With Extra Class')).toHaveClass('extra-class');
    });

    it('should render ReactNode child directly', () => {
        const Child = () => <span data-testid="custom-child">Node Child</span>;
        renderComponent({ children: <Child /> });
        expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });

    it('should call formattedText for string children', () => {
        renderComponent({ children: 'Format ++Me++' });
        expect(formattedText).toHaveBeenCalledWith('Format ++Me++');
    });

    it('should return children default when text is undefined', () => {
        (formattedText as jest.Mock).mockReturnValue(undefined);
        renderComponent({ children: 'Format ++Me++' });
        expect(screen.getByText('Format ++Me++')).toBeInTheDocument();
    });

    it('should use translator and render translated value', async () => {
        const mockTranslator = jest.fn(() => 'translated') as unknown as  TranslatorFunction;
        mockIsReactNode.mockReturnValue(false);
        mockFormattedText.mockImplementation((text: string) => text);
        mockTranslateValue.mockImplementation(() => 'translated-value');
        renderComponent({
            name: 'name',
            children: 'translate',
            translator: mockTranslator,
            textsToTranslate: ['translate']
        });
        expect(translateValue).toHaveBeenCalledWith(
            'translate',
            'name',
            mockTranslator,
            ['translate']
        );
        await waitFor(() => {
            const el = screen.getByTestId('ds-text');
            expect(el).toBeInTheDocument();
            expect(el.textContent).toBe('translated-value');
        });
    });

});
