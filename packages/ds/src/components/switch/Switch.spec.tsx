import React from 'react';

import '@testing-library/jest-dom'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
        generateComponentId: jest.fn(() => 'mock-id'),
    }
});

jest.mock('../../elements', () => ({
    Text: (props: any) => (<p {...props}/>),
}))

import Switch from './Switch';

describe('<Switch/>', () => {
    const defaultProps = {
        checked: false
    };

    const renderComponent = (props: any = {}) => {
        return render(<Switch {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-switch');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-switch');

        const button = screen.getByTestId('ds-switch-button')
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('ds-switch__button');
        expect(button).toBeEnabled();
    });

    it('should render component with only props label.', () => {
        renderComponent({ label: 'label' });
        expect(screen.getByTestId('ds-switch')).toBeInTheDocument();

        expect(screen.getByTestId('ds-switch-label')).toBeInTheDocument();

        expect(screen.getByTestId('ds-switch-button')).toBeInTheDocument();

        expect(screen.queryByTestId('ds-switch-label-after')).not.toBeInTheDocument();
    });

    it('should render component with only props labelAfter.', () => {
        renderComponent({ labelAfter: 'labelAfter' });
        expect(screen.getByTestId('ds-switch')).toBeInTheDocument();

        expect(screen.queryByTestId('ds-switch-label')).not.toBeInTheDocument();

        expect(screen.getByTestId('ds-switch-button')).toBeInTheDocument();

        expect(screen.queryByTestId('ds-switch-label-after')).toBeInTheDocument();
    });

    it('should render component with props disable true.', () => {
        renderComponent({ disabled: true, label: 'label', labelAfter: 'labelAfter'});

        const component = screen.getByTestId('ds-switch');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-switch__disabled');

        const label = screen.getByTestId('ds-switch-label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('ds-switch__label--disabled');

        const button = screen.getByTestId('ds-switch-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('ds-switch__button');
        expect(button).toBeDisabled();

        const labelAfter = screen.getByTestId('ds-switch-label-after')
        expect(labelAfter).toBeInTheDocument();
        expect(labelAfter).toHaveClass('ds-switch__label--disabled');
    });

    it('should render component with props checked true.', () => {
        renderComponent({ checked: true, label: 'label', labelAfter: 'labelAfter'});
        expect(screen.getByTestId('ds-switch')).toBeInTheDocument();

        expect(screen.getByTestId('ds-switch-label')).toBeInTheDocument();

        const button = screen.getByTestId('ds-switch-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('ds-switch__button');
        expect(button).toHaveClass('ds-switch__button--checked');

        expect(screen.getByTestId('ds-switch-label-after')).toBeInTheDocument();
    });

    it('should click and switch checked', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, checked: false });
        const button = screen.getByTestId('ds-switch-button');
        expect(button).toHaveClass('ds-switch__button--no-checked');
        await act(async () => {
            fireEvent.click(button!)
        })
        await waitFor(() => {
            expect(button).toHaveClass('ds-switch__button--checked');
            expect(mockOnChange).toHaveBeenCalled();
        })
    });


});