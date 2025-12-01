import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Internationalization from './Internationalization';

describe('<Internationalization/>', () => {
    const mockOnChange = jest.fn();
    const mockCurrentLanguageOptions = jest.fn();
    const defaultProps = {
        onChange: mockOnChange,
        currentLanguageOptions: mockCurrentLanguageOptions
    };

    const renderComponent = (props: any = {}) => {
        return render(<Internationalization {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ui-internationalization')).toBeInTheDocument();
        const flagSpan = screen.getByTestId(`ui-internationalization-flag`);
        expect(flagSpan).toBeInTheDocument();
        expect(flagSpan).toHaveTextContent('🇺🇸');
    });

    it(`should render component with languageOptions props and dont find lang in languageOptions.`, () => {
        const languageOptions = [
            { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
            { code: 'es', label: 'Español', flag: '🇪🇸' },
        ]
        renderComponent({ lang: 'en', languageOptions });
        expect(screen.getByTestId('ui-internationalization')).toBeInTheDocument();
        const flagSpan = screen.getByTestId(`ui-internationalization-flag`);
        expect(flagSpan).toBeInTheDocument();
        expect(flagSpan).toHaveTextContent('🇧🇷');

        expect(mockCurrentLanguageOptions).toHaveBeenCalledWith(languageOptions);
    });

    it('should render component with languageOptionsCode props.', () => {
        renderComponent({ languageOptionsCode: ['en']});
        expect(screen.getByTestId('ui-internationalization')).toBeInTheDocument();
        const flagSpan = screen.getByTestId(`ui-internationalization-flag`);
        expect(flagSpan).toBeInTheDocument();
        expect(flagSpan).toHaveTextContent('🇺🇸');
    });

    it('should render component with languageOptions props empty.', () => {
        renderComponent({ languageOptions: [], languageOptionsCode: ['en']});
        expect(screen.getByTestId('ui-internationalization')).toBeInTheDocument();
        const flagSpan = screen.getByTestId(`ui-internationalization-flag`);
        expect(flagSpan).toBeInTheDocument();
        expect(flagSpan).toHaveTextContent('🇺🇸');
    });

    it('should render component with and open dropdown.', () => {
        renderComponent();
        expect(screen.getByTestId('ui-internationalization')).toBeInTheDocument();

        const flagSpan = screen.getByTestId(`ui-internationalization-flag`);

        expect(flagSpan).toBeInTheDocument();
        expect(flagSpan).toHaveTextContent('🇺🇸');

        const openDropdownButton = screen.getByTestId('ui-internationalization-button');
        expect(openDropdownButton).toBeInTheDocument();

        fireEvent.click(openDropdownButton);

        expect(screen.getByTestId('ui-internationalization-dropdown')).toBeInTheDocument();

        const buttonLang = screen.getByTestId('ui-internationalization-dropdown-button-pt-BR');
        expect(buttonLang).toBeInTheDocument();

        fireEvent.click(buttonLang);

        expect(flagSpan).toHaveTextContent('🇧🇷');
        expect(mockOnChange).toHaveBeenCalled();
        expect(mockCurrentLanguageOptions).toHaveBeenCalledWith([
            { code: 'en', label: 'English', flag: '🇺🇸' },
            { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
            { code: 'es', label: 'Español', flag: '🇪🇸' },
        ]);
    });

    it('should prevent default on mouseDown in language option button', () => {
        renderComponent();
        const openDropdownButton = screen.getByTestId('ui-internationalization-button');
        fireEvent.click(openDropdownButton);

        const buttonLang = screen.getByTestId('ui-internationalization-dropdown-button-pt-BR');
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        Object.defineProperty(mouseDownEvent, 'preventDefault', { value: jest.fn() });

        buttonLang.dispatchEvent(mouseDownEvent);

        expect(mouseDownEvent.preventDefault).toHaveBeenCalled();
    });

})