import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import DependencyFallback from './DependencyFallback';

describe('<DependencyFallback/>', () => {
    const defaultProps = {};

    const renderComponent = (props: any = {}) => {
        return render(<DependencyFallback {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-dependency-fallback');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-dependency-fallback');

        const text = screen.getByTestId('ui-dependency-fallback-text')
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('No list of Dependency were found. Please create a Dependency before creating a Resource!!');
    });

    it('should render component with resourceName and dependencyName  props.', () => {
        renderComponent({ resourceName: 'Custom Resource Name', dependencyName: 'Custom Dependency Name'});
        expect(screen.getByTestId('ui-dependency-fallback')).toBeInTheDocument();

        const text = screen.getByTestId('ui-dependency-fallback-text')
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('No list of Custom Dependency Name were found. Please create a Custom Dependency Name before creating a Custom Resource Name!!');
    });

    it('should render component with minimal button props.', () => {
        renderComponent({ button: { label: 'Custom Button' } });
        expect(screen.getByTestId('ui-dependency-fallback')).toBeInTheDocument();

        const button = screen.getByTestId('ui-dependency-fallback-button')
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Custom Button');
    });
})