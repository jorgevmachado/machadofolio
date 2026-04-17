import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('./internationalization', () => ({
    Internationalization: () => <div data-testid="internationalization-mock"/>,
}));

import Navbar from './Navbar';

describe('<Navbar/>', () => {
    const defaultProps = {
        title: 'Title',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Navbar {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-navbar');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-navbar');
        expect(component).toHaveTextContent('Title');
        expect(component).toHaveTextContent('Welcome');
    });

    it('Should render component with userName props.', () => {
        renderComponent({ userName: 'UserName'});
        const component = screen.getByTestId('ui-navbar');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-navbar');
        expect(component).toHaveTextContent('Title');
        expect(component).toHaveTextContent('Welcome, UserName');
    });

    it('should render component with action props.', () => {
        const mockActionClick = jest.fn();
        const mockAction = {
            label: 'Action',
            onClick: mockActionClick,
        }
        renderComponent({ action: mockAction});
        expect(screen.getByTestId('ui-navbar')).toBeInTheDocument();
        const actionButton = screen.getByTestId('ui-navbar-action');
        expect(actionButton).toBeInTheDocument();
        expect(actionButton).toHaveTextContent('Action');
        actionButton.click();
        expect(mockActionClick).toHaveBeenCalled();
    });

    it(`should render component with internationalization props.`, () => {
        renderComponent({ userName: `userName`, internationalization: {}});
        expect(screen.getByTestId(`internationalization-mock`)).toBeInTheDocument();
    });
});