import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { type TRoute } from '../../utils';

import Sidebar from './Sidebar';

jest.mock('./dropdown', () => ({
    __esModule: true,
    default: ({ menu }: any) => (
        <div data-testid={`mock-dropdown-${menu.key}`}>
            {menu.title}
        </div>
    ),
}));


describe('<Sidebar/>', () => {
    const menuMock: Array<TRoute> = [
        {
            key: 'item-1',
            icon: 'react',
            path: '/item-1',
            type: 'private',
            title: 'Item One',
        },
        {
            key: 'item-2',
            icon: 'react',
            path: '/item-2',
            type: 'private',
            title: 'Item Two',
        },
        {
            key: 'parent',
            icon: 'react',
            path: '/parent',
            type: 'private',
            title: 'Parent',
            children: [
                {
                    key: 'child-1',
                    icon: 'react',
                    path: '/child-1',
                    type: 'private',
                    title: 'Child One',
                },
            ],
        },
    ];

    const defaultProps = {
        menu: menuMock,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Sidebar {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('applies correct className when closed', () => {
        renderComponent();
        const component = screen.getByTestId('ui-sidebar');
        expect(component).toHaveClass('ui-sidebar ui-sidebar__closed');
    });

    it('renders with default classes and open state initially', () => {
        renderComponent({ isSidebarOpen: true });
        const component = screen.getByTestId('ui-sidebar');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-sidebar ui-sidebar__open');
    });

    it('updates state when isSidebarOpen prop changes', () => {
        const { rerender } = renderComponent({ isSidebarOpen: true });
        const component = screen.getByTestId('ui-sidebar');
        expect(component).toHaveClass('ui-sidebar ui-sidebar__open');
        rerender(<Sidebar menu={menuMock} isSidebarOpen={false} />);
        expect(component).toHaveClass('ui-sidebar ui-sidebar__closed');
        rerender(<Sidebar menu={menuMock} isSidebarOpen />);
        expect(component).toHaveClass('ui-sidebar ui-sidebar__open');
    });

    it('calls onToggle correctly when clicking the button', () => {
        const onToggle = jest.fn();
        renderComponent({ onToggle });
        const button = screen.getByRole('button', { hidden: true });
        fireEvent.click(button);
        expect(onToggle).toHaveBeenCalledWith(true);
        fireEvent.click(button);
        expect(onToggle).toHaveBeenLastCalledWith(false);
    });

    it('renders all menu items and Dropdown for children', () => {
        renderComponent({ isSidebarOpen: true });
        expect(screen.getByText('Item One')).toBeInTheDocument();
        expect(screen.getByText('Item Two')).toBeInTheDocument();
        expect(screen.getByTestId('mock-dropdown-parent')).toBeInTheDocument();
    });

    it('calls onLinkClick when clicking a menu item (without children)', () => {
        const onLinkClick = jest.fn();
        renderComponent({ onLinkClick, isSidebarOpen: true });
        const item = screen.getByText('Item One');
        fireEvent.click(item);
        expect(onLinkClick).toHaveBeenCalledWith('/item-1');
    });

    it('updates window.location.href when clicking without onLinkClick', () => {
        delete (window as any).location;
        (window as any).location = { href: '' };
        renderComponent({ isSidebarOpen: true });
        const item = screen.getByText('Item One');
        fireEvent.click(item);
        expect(window.location.href).toBe('/item-1');
    });

    it('does not break if menu is not provided', () => {
        render(<Sidebar menu={[]} />);
        expect(screen.getByTestId('ui-sidebar')).toBeInTheDocument();
    });
});