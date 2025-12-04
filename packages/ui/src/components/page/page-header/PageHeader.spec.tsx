import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';


import PageHeader from './PageHeader';

describe('<PageHeader/>', () => {
  const mockActionClick = jest.fn();
  const mockAction = {
    label: 'Action',
    onClick: mockActionClick
  }

  const defaultProps = {
    resourceName: 'Page Header',
  };

  const renderComponent = (props: any = {}) => {
    return render(<PageHeader {...defaultProps} {...props}/>);
  }

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render component with props default.', () => {
    renderComponent();
    expect(screen.getByTestId('ui-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-header-title')).toBeInTheDocument();
    expect(screen.queryByTestId('ui-page-header-action')).not.toBeInTheDocument();
  });

  it('should render component with action props.', () => {
    renderComponent({ action: mockAction });
    expect(screen.getByTestId('ui-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-header-title')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-header-action')).toBeInTheDocument();
  });

  it('should render component with custom action props.', () => {
    renderComponent({ action: {...mockAction, label: 'Custom Action', context: 'secondary'} });
    expect(screen.getByTestId('ui-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-header-title')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-header-action')).toBeInTheDocument();
  });

  it('should render click in button when received action props.', () => {
    renderComponent({ action: mockAction });
    expect(screen.getByTestId('ui-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('ui-page-header-title')).toBeInTheDocument();
    const actionButton = screen.getByTestId('ui-page-header-action')
    expect(actionButton).toBeInTheDocument();

    actionButton.click();

    expect(mockActionClick).toHaveBeenCalled();
  });

})