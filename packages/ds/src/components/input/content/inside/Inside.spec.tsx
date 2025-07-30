import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render } from '@testing-library/react';

jest.mock('../../../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

const mockIcon = jest.fn();
jest.mock('../../../../elements', () => ({
    Icon: (props: any) => {
        mockIcon(props);
        return <span data-testid="mock-icon" onClick={props.onClick} className={props.className}></span>;
    },
}));

const mockUseInput = jest.fn();
jest.mock('../../InputContext', () => ({
    __esModule: true,
    useInput: () => mockUseInput(),
}));

import Inside from './Inside';


describe('<Inside/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const fakeIconProp = { name: 'react' };

    const defaultProps = {
        show: true,
        position: 'left'
    }

    const renderComponent = (props: any = {}) => {
        return render(<Inside {...defaultProps} {...props}/>);
    }

    it('should not render anything if there are no icons or counter', () => {
        mockUseInput.mockReturnValue({
            hasIcon: jest.fn().mockReturnValue(false),
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });

        const { container, queryByTestId } = renderComponent();
        expect(container.firstChild).toBeNull();
        expect(queryByTestId('ds-inside')).toBeNull();
    });

    it('should not render anything if flag show is false', () => {
        mockUseInput.mockReturnValue({
            hasIcon: jest.fn().mockReturnValue(false),
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });

        const { container, queryByTestId } = renderComponent({ show: false });
        expect(container.firstChild).toBeNull();
        expect(queryByTestId('ds-inside')).toBeNull();
    });

    it('should render icon on the left', () => {
        mockUseInput.mockReturnValue({
            hasIcon: (pos: string) => pos === 'left',
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });
        const { getByTestId } = renderComponent({ icon: fakeIconProp, position: 'left' });
        expect(getByTestId('ds-inside')).toBeInTheDocument();
        expect(getByTestId('mock-icon')).toBeInTheDocument();
        expect(mockIcon).toHaveBeenCalledWith(expect.objectContaining(fakeIconProp));
    });

    it('should render icon on the right', () => {
        mockUseInput.mockReturnValue({
            hasIcon: (pos: string) => pos === 'right',
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });
        const { getByTestId } = renderComponent({ icon: fakeIconProp, position: 'right' });
        expect(getByTestId('ds-inside')).toBeInTheDocument();
        expect(getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render counter only on the right', () => {
        const fakeCounter = <span data-testid="mock-counter">12/20</span>;
        mockUseInput.mockReturnValue({
            hasIcon: jest.fn().mockReturnValue(false),
            hasCounter: true,
            counterElement: fakeCounter,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });
        const { getByTestId } = renderComponent({ position: 'right' });
        expect(getByTestId('ds-inside')).toBeInTheDocument();
        expect(getByTestId('mock-counter')).toBeInTheDocument();
    });

    it('should not render counter on the left', () => {
        mockUseInput.mockReturnValue({
            hasIcon: jest.fn().mockReturnValue(false),
            hasCounter: true,
            counterElement: <span data-testid="mock-counter">9/20</span>,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });
        const { container, queryByTestId } = renderComponent({ position: 'left' });
        expect(container.firstChild).toBeNull();
        expect(queryByTestId('ds-inside')).toBeNull();
    });

    it('should use elements from the hook instead of icon when available', () => {
        const leftElem = <span data-testid="icon-left-hook" />;
        mockUseInput.mockReturnValue({
            hasIcon: jest.fn().mockReturnValue(false),
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: leftElem,
            iconRightElement: undefined,
        });
        const { getByTestId } = renderComponent({ position: 'left' });
        expect(getByTestId('icon-left-hook')).toBeInTheDocument();
    });

    it('should use icon for password and trigger onClick when clicked', () => {
        const toggleMock = jest.fn();
        mockUseInput.mockReturnValue({
            hasIcon: (pos: string) => pos === 'right',
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });
        const { getByTestId } = renderComponent({
            position: 'right',
            icon: fakeIconProp,
            onClick: toggleMock,
            isPassword: true,
        });
        const icon = getByTestId('mock-icon');
        fireEvent.click(icon);
        expect(toggleMock).toHaveBeenCalled();
        expect(icon.className).toMatch(/password/);
    });

    it('should set the correct css classes on the div', () => {
        mockUseInput.mockReturnValue({
            hasIcon: (pos: string) => pos === 'right',
            hasCounter: false,
            counterElement: undefined,
            iconLeftElement: undefined,
            iconRightElement: undefined,
        });
        const { getByTestId } = renderComponent({ icon: fakeIconProp, position: 'right' });
        expect(getByTestId('ds-inside').className).toContain('ds-inside__icon--right');
    });

});