import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import Delete from './Delete';

describe('<Delete/>', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
      item: {
        id: '123',
        age: 150,
        name: 'name',
      },
      onClose: mockOnClose,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Delete {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

  it('should render component with props default.', () => {
    renderComponent();
    const component = screen.getByTestId('ui-delete');
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('ui-delete');

    expect(screen.getByTestId('ui-delete-btn-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('ui-delete-btn-submit')).toBeInTheDocument();
  });

  it('should click in cancel button and call onClose function', () => {
    renderComponent();
    const cancelButton = screen.getByTestId('ui-delete-btn-cancel');
    cancelButton.click();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should click in delete button and call onDelete and onClose function', () => {
    const mockOnDelete = jest.fn();
    renderComponent({ onDelete: mockOnDelete });
    const deleteButton = screen.getByTestId('ui-delete-btn-submit');
    deleteButton.click();
    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

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

  it('should render component with custom delete button props.', () => {
    const customDeleteClick = jest.fn();
    const customDeleteButton =  {
      context: 'secondary',
      onClick: customDeleteClick,
      children: 'Super Delete',
      'data-testid': 'custom-delete-button'
    }
    renderComponent({  deleteButton: customDeleteButton });
    const deleteButton = screen.getByTestId('custom-delete-button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveTextContent('Super Delete');
    deleteButton.click();
    expect(customDeleteClick).toHaveBeenCalled();
  });
})