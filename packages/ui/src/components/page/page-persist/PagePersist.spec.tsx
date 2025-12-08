import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';
import { fn } from 'storybook/test';
import PagePersist from './PagePersist';

describe('<PagePersist/>', () => {
  const mockOnClose = jest.fn();
  const mockSubmit = jest.fn();
  const mockInputs = [
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
  ];

  const defaultProps = {
    inputs: mockInputs,
    onClose: mockOnClose,
  };

  const renderComponent = (props: any = {}) => {
    return render(<PagePersist {...defaultProps} {...props} />);
  }

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render component with props default.', () => {
    renderComponent({ inputs: []});
    expect(screen.getByTestId('ui-page-persist')).toBeInTheDocument();
    expect(screen.queryByTestId('ui-page-persist-inputs')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ui-page-persist-actions')).not.toBeInTheDocument();
  });

  it('should render component with all inputs.', () => {
    renderComponent();
    expect(screen.getByTestId('ui-page-persist')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-persist-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-persist-actions')).toBeInTheDocument();

    const nameInput = screen.getAllByTestId('ui-page-persist-inputs-0').find(i => i.getAttribute('name') === 'name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('placeholder', 'Enter a name');

    const ageInput = screen.getAllByTestId('ui-page-persist-inputs-1').find(i => i.getAttribute('name') === 'age');
    expect(ageInput).toBeInTheDocument();
    expect(ageInput).toHaveAttribute('placeholder', 'Enter a age');

    const selectInput = screen.getAllByTestId('ui-page-persist-inputs-2').find(i => i.getAttribute('name') === 'type');
    expect(selectInput).toBeInTheDocument();
    expect(selectInput).toHaveAttribute('placeholder', 'Enter a Select');

    expect(screen.getByTestId('ui-page-persist-actions-submit')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-persist-actions-cancel')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    renderComponent();
    const cancelButton = screen.getByTestId('ui-page-persist-actions-cancel');
    expect(cancelButton).toBeInTheDocument();
    cancelButton.click();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onSubmit when input value changes and form is submitted', () => {
    renderComponent({ onSubmit: mockSubmit });
    const nameInput = screen.getByPlaceholderText('Enter a name');
    nameInput.focus();
    // @ts-ignore
    nameInput.value = 'John';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    const form = screen.getByTestId('ui-page-persist');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should update currentItem with selected object type is select', () => {
    renderComponent({ onSubmit: mockSubmit });
    const selectInput = screen.getAllByTestId('ui-page-persist-inputs-2').find(i => i.getAttribute('name') === 'type');
    if (selectInput) {
      Object.defineProperty(selectInput, 'value', { value: 'br', writable: true });
      selectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const form = screen.getByTestId('ui-page-persist');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.objectContaining({ id: 'br', name: 'Brasil', name_code: 'br' })
      })
    );
  });

  it('should render component and click in submit button when dont received onSubmit prop', () => {
    renderComponent();
    const form = screen.getByTestId('ui-page-persist');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    expect(mockOnClose).toHaveBeenCalledWith('submitted');
  })

  it('should render component with custom cancel button props.', () => {
    const customCancelClick = jest.fn();
    const customCancelButton =  {
      context: 'secondary',
      onClick: customCancelClick,
      children: 'Super Cancel',
      'data-testid': 'custom-cancel-button'
    }
    renderComponent({  cancelButton: customCancelButton });
    const cancelButton = screen.getByTestId('custom-cancel-button');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Super Cancel');
    cancelButton.click();
    expect(customCancelClick).toHaveBeenCalled();
  });

  it('should render component with custom submit button props.', () => {
    const customSubmitClick = jest.fn();
    const customSubmitButton =  {
      context: 'secondary',
      onClick: customSubmitClick,
      children: 'Super Submit',
      'data-testid': 'custom-submit-button'
    }
    renderComponent({  submitButton: customSubmitButton });
    const submitButton = screen.getByTestId('custom-submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Super Submit');
    submitButton.click();
    expect(customSubmitClick).toHaveBeenCalled();
  });

})