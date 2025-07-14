import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import Sidebar from './Sidebar';

describe('<Sidebar/>', () => {
    const defaultProps = {};

    const renderComponent = (props: any = {}) => {
        return render(<Sidebar {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-sidebar');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-sidebar');
    });
});