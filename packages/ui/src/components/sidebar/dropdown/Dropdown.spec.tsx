import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('@repo/ds', () => ({
    __esModule: true,
    Icon: ({ icon }: any) => <span data-testid="mock-icon">{icon}</span>,
}));

import Dropdown from './Dropdown';

describe('<Dropdown/>', () => {
    const menuMock = {
        key: 'parent',
        icon: 'react',
        path: '/parent',
        type: 'private',
        title: 'Parent',
        children: [
            {
                key: 'child-1',
                icon: 'box',
                path: '/child-1',
                type: 'private',
                title: 'Child-One',
            },
            {
                key: 'child-2',
                icon: 'key',
                path: '/child-2',
                type: 'private',
                title: 'Child Two',
                children: [
                    {
                        key: 'sub-child-1',
                        icon: 'tag',
                        path: '/sub-child-1',
                        type: 'private',
                        title: 'SubChild',
                    }
                ]
            },
            {
                key: 'child-3',
                icon: 'tv',
                path: '/child-3',
                type: 'private',
                title: 'Child Three',
                children: [
                    {
                        key: 'sub-child-3',
                        icon: undefined,
                        path: '/sub-child-3',
                        type: 'private',
                        title: 'SubChild 2',
                    }
                ]
            },
        ],
    };


    const onLinkClickMock = jest.fn();

    const defaultProps = {
        menu: menuMock,
        isOpen: false,
        onLinkClick: onLinkClickMock
    }

    const renderComponent = (props: any = {}) => {
        return render(<Dropdown {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render only the icon when closed', () => {
        renderComponent({ isOpen: false });
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.queryByText('Parent')).not.toBeInTheDocument();
    });

    it('should render the full title when isOpen=true', () => {
        renderComponent({ isOpen: true });
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('should expand and show submenu when the main menu is clicked', () => {
        renderComponent({ isOpen: true });
        expect(screen.queryByText('Child-One')).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Parent'));
        expect(screen.getByText('Child-One')).toBeInTheDocument();
        expect(screen.getByText('Child Two')).toBeInTheDocument();
    });

    it('should collapse submenu when clicked again', () => {
        renderComponent({ isOpen: true });
        const parentMenu = screen.getByText('Parent');
        fireEvent.click(parentMenu);
        expect(screen.getByText('Child-One')).toBeInTheDocument();
        fireEvent.click(parentMenu);
        expect(screen.queryByText('Child-One')).not.toBeInTheDocument();
    });

    it('triggers onLinkClick when clicking a submenu link', () => {
        renderComponent({ isOpen: true });
        fireEvent.click(screen.getByText('Parent'));
        fireEvent.click(screen.getByText('Child-One'));
        expect(onLinkClickMock).toHaveBeenCalledTimes(1);
        expect(onLinkClickMock).toHaveBeenCalledWith('/parent/child-1');
    });

    it('renders correct child icons and the title', () => {
        renderComponent({ isOpen: true });
        fireEvent.click(screen.getByText('Parent'));
        expect(screen.getAllByTestId('mock-icon').length).toBeGreaterThan(0);
        expect(screen.getByText('Child-One')).toBeInTheDocument();
    });

    it('should recursively render Dropdown if there is a child with children', () => {
        renderComponent({ isOpen: true });
        fireEvent.click(screen.getByText('Parent'));
        expect(screen.getByTestId('ui-dropdown-submenu-link')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Child Two'));
        expect(screen.getByText('SubChild')).toBeInTheDocument();
    });

    it('should recursively render Dropdown if there is a child with children and isOpen is false', () => {
        renderComponent({ isOpen: false });
        fireEvent.click(screen.getByText('react'));
        fireEvent.click(screen.getByText('key'));
        expect(screen.getByText('key')).toBeInTheDocument();
    });

    it('uses grandParentPath when provided', () => {
        renderComponent({ isOpen: true, grandParentPath: '/grandParent' });
        fireEvent.click(screen.getByText('Parent'));
        fireEvent.click(screen.getByText('Child-One'));
        expect(onLinkClickMock).toHaveBeenCalledWith('/grandParent/parent/child-1');
    });

    it('renders only the icon when isOpen=false', () => {
        renderComponent({ isOpen: false });
        expect(screen.getByText('react')).toBeInTheDocument();
    });

    it('should render Dropdown with abbreviation when there is no icon.', () => {
        renderComponent({ isOpen: false });
        fireEvent.click(screen.getByText('react'));
        fireEvent.click(screen.getByText('tv'));
        expect(screen.getByText('S')).toBeInTheDocument();
    });

});