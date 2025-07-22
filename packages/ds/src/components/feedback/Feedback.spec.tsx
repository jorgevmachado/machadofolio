import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../elements', () => ({
    __esModule: true,
    default: (props: any) => (<p {...props}/>),
    Text: (props: any) => (<p {...props}/>),
}));

import Feedback from './Feedback';

describe('<Feedback/>', () => {
    const defaultProps = {
        context: 'error',
        children: 'Hello World!'
    };

    const renderComponent = (props: any = {}) => {
        return render(<Feedback {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-feedback');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-feedback');
    });

    it('should render the component with context other than error with custom className.', () => {
        renderComponent({ context: 'success', className: 'custom-class' });
        const component = screen.getByTestId('ds-feedback');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-feedback');
        expect(component).toHaveClass('custom-class');
    })
});