import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../elements', () => ({
    __esModule: true,
    default: (props: any) => (<p {...props}/>),
    Text: (props: any) => (<p {...props}/>),
}))

import Label from './Label';

describe('<Label/>', () => {

    const renderComponent = (props: any = {}) => {
        return render(<Label {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-label');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-label');
    });

    it('Should render the component with component id.', () => {
        renderComponent({ componentId: 'label', });
        const component = screen.getByTestId('ds-label');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-label');
    });

    it('Should render the component with label.', () => {
        renderComponent({ label: 'Label' });
        const component = screen.getByTestId('ds-label');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-label');
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('Should render the component with label and tip.', () => {
        renderComponent({ label: 'Label', tip: '(Tip)' });
        const component = screen.getByTestId('ds-label');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-label');
        expect(screen.getByText('Label')).toBeInTheDocument();
        expect(screen.getByText('(Tip)')).toBeInTheDocument();
    });

    it('Should render the component with tag legend.', () => {
        renderComponent({ label: 'Label', tag: 'legend' });
        const component = screen.getByTestId('ds-label');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-label');
        expect(screen.getByText('Label')).toBeInTheDocument();
    });
});