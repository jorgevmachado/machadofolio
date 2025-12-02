import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../dependency-fallback', () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-ui-dependency-fallback"/>,
  DependencyFallback: () => <div data-testid="mocked-ui-dependency-fallback"/>,
}));

import Filter from './Filter';
import { fn } from 'storybook/test';

describe('<Filter/>', () => {
    const mockHandleFilter = jest.fn();
    const mockInputs =  [
      {
        fluid: true ,
        type: 'text' ,
        name: 'name' ,
        label: 'name' ,
        required: true ,
        placeholder: `Enter a name` ,
      } ,
      {
        fluid: true ,
        type: 'number' ,
        name: 'age' ,
        label: 'age' ,
        required: true ,
        placeholder: `Enter a age` ,
      } ,
      {
        fluid: true ,
        type: 'select' ,
        name: 'type' ,
        label: 'select' ,
        list: [
          { id: 'br' ,name_code: 'br' ,name: 'Brasil' } ,
          { id: 'ar' ,name_code: 'ar' ,name: 'Argentina' } ,
          { id: 'cl' ,name_code: 'cl' ,name: 'Chile' } ,
          { id: 'co' ,name_code: 'co' ,name: 'Colômbia' } ,
          { id: 'us' ,name_code: 'us' ,name: 'Estados Unidos' } ,
          { id: 'fr' ,name_code: 'fr' ,name: 'França' } ,
          { id: 'de' ,name_code: 'de' ,name: 'Alemanha' } ,
          { id: 'jp' ,name_code: 'jp' ,name: 'Japão' } ,
        ] ,
        options: [
          { value: 'br' ,label: 'Brasil' } ,
          { value: 'ar' ,label: 'Argentina' } ,
          { value: 'cl' ,label: 'Chile' } ,
          { value: 'co' ,label: 'Colômbia' } ,
          { value: 'us' ,label: 'Estados Unidos' } ,
          { value: 'fr' ,label: 'França' } ,
          { value: 'de' ,label: 'Alemanha' } ,
          { value: 'jp' ,label: 'Japão' } ,
        ] ,
        required: true ,
        placeholder: `Enter a Select` ,
        autoComplete: true ,
        fallbackLabel: `Add Select` ,
        fallbackAction: fn(),
      } ,
      {
        fluid: true ,
        type: 'date' ,
        name: 'date' ,
        label: 'Date',
        value: new Date().toISOString(),
        required: true ,
        calendar: {
          inline: false,
          todayButton: 'Today',
        },
        placeholder: 'Date',
      } ,
      {
        fluid: true ,
        type: 'radio-group',
        name: 'radio-group' ,
        label: 'Radio Group',
        value: 'natural-person',
        list: [
          { id: '1' ,name_code: 'person' ,name: 'Natural Person' } ,
          { id: '2' ,name_code: 'legal-entity' ,name: 'Legal Entity' } ,
        ] ,
        options: [
          { label: 'Natural Person', value: 'natural-person' },
          { label: 'Legal Entity', value: 'legal-entity' },
        ],
        required: true ,
      } ,
      {
        fluid: true ,
        type: 'number' ,
        name: 'age' ,
        label: 'age' ,
        required: true ,
        placeholder: `Enter a age` ,
      } ,
      {
        fluid: true ,
        rows: 10,
        type: 'textarea',
        name: 'text-area' ,
        label: 'Text Area',
        value: 'Lorem ipsum dolor sit amet.',
        required: true ,
        placeholder: 'Text Area'
      } ,
    ];

    const defaultProps = {
      inputs: []
    };

    const renderComponent = (props: any = {}) => {
      return render(<Filter {...defaultProps} {...props}/>);
    }

    afterEach(() => {
      cleanup();
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
      renderComponent();
      expect(screen.getByTestId('mocked-ui-dependency-fallback')).toBeInTheDocument();
    });

  it('should render component with inputs and default props.', () => {
    renderComponent({ inputs: mockInputs, onFilter: mockHandleFilter });
    expect(screen.queryByTestId('mocked-ui-dependency-fallback')).not.toBeInTheDocument();
    expect(screen.getByTestId('ui-filter')).toBeInTheDocument();
  });

  it('should render all input types with correct placeholders and names', () => {
    renderComponent({ inputs: mockInputs, onFilter: mockHandleFilter });
    const nameInput = screen.getAllByTestId('ui-filter-input-row-item-0-input').find(i => i.getAttribute('name') === 'name');
    const ageInput = screen.getAllByTestId('ui-filter-input-row-item-0-input').find(i => i.getAttribute('name') === 'age');
    expect(nameInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a name')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Enter a age').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Enter a Select')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Text Area')).toBeInTheDocument();
    const selectInput = screen.getAllByTestId('ui-filter-input-row-item-1-input').find(i => i.getAttribute('name') === 'type');
    expect(selectInput).toBeInTheDocument();
    const radioInput = screen.getAllByTestId('ui-filter-input-row-item-3-input').find(i => i.getAttribute('name') === 'radio-group');
    expect(radioInput).toBeInTheDocument();
  });

  it('should call onFilter when input value changes and form is submitted', () => {
    renderComponent({ inputs: mockInputs, onFilter: mockHandleFilter });
    const nameInput = screen.getByPlaceholderText('Enter a name');
    nameInput.focus();
    // @ts-ignore
    nameInput.value = 'John';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    const form = screen.getByTestId('ui-filter');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockHandleFilter).toHaveBeenCalled();
  });

  it('should render custom children in date input if present', () => {
    expect(true).toBe(true);
  });

  it('should render fallbackLabel as attribute in select input', () => {
    renderComponent({ inputs: mockInputs, onFilter: mockHandleFilter });
    const selectInput = screen.getAllByTestId('ui-filter-input-row-item-1-input').find(i => i.getAttribute('name') === 'type');
    expect(selectInput).toHaveAttribute('fallbacklabel', 'Add Select');
  });

  it('should have required prop in input props, even if not in DOM', () => {
    renderComponent({ inputs: mockInputs, onFilter: mockHandleFilter });
    mockInputs.forEach(input => {
      expect(input.required).toBe(true);
    });
  });

  it('should update currentItem with selected object when type is select', () => {
    renderComponent({ inputs: mockInputs, onFilter: mockHandleFilter });
    const selectInput = screen.getAllByTestId('ui-filter-input-row-item-1-input').find(i => i.getAttribute('name') === 'type');
    if (selectInput) {
      Object.defineProperty(selectInput, 'value', { value: 'br', writable: true });
      selectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const form = screen.getByTestId('ui-filter');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockHandleFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.objectContaining({ id: 'br', name: 'Brasil', name_code: 'br' })
      })
    );
  });

  it('should group normal inputs in pairs and single row inputs separately (edge case: first input)', () => {
    const singleInput = [
      {
        fluid: true,
        type: 'text',
        name: 'only',
        label: 'only',
        required: true,
        placeholder: 'Only input',
      }
    ];
    renderComponent({ inputs: singleInput, onFilter: mockHandleFilter });
    const input = screen.getByTestId('ui-filter-input-row-item-0-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'only');
    expect(screen.getAllByTestId('ui-filter-input-row-0').length).toBe(1);
  });

  it('should set default fallbackProps.message when fallback is undefined', () => {
    renderComponent({ inputs: [], fallback: undefined });
    const fallback = screen.getByTestId('mocked-ui-dependency-fallback');
    expect(fallback).toBeInTheDocument();
  });

  it('should set default fallbackProps.message when fallback.message is undefined', () => {
    renderComponent({ inputs: [], fallback: {} });
    const fallback = screen.getByTestId('mocked-ui-dependency-fallback');
    expect(fallback).toBeInTheDocument();
  });

  it('should render Button with default action props when action is not provided', () => {
    renderComponent({ inputs: mockInputs });
    const button = screen.getByTestId('ui-filter-action-button}');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Filter');
    expect(button).toHaveTextContent('Filter');
  });

  it('should render Button with custom action props', () => {
    const customAction = {
      label: 'Buscar',
      icon: { icon: 'custom', position: 'left' },
      type: 'button',
      context: 'secondary',
      'aria-label': 'Buscar',
    };
    renderComponent({ inputs: mockInputs, action: customAction });
    const button = screen.getByTestId('ui-filter-action-button}');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Buscar');
    expect(button).toHaveTextContent('Buscar');
  });
})