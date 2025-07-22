import { jest } from '@jest/globals';

let lastSidebarProps: any = null;

jest.mock('../../components', () => {
    return {
        Content: (props: any) => React.createElement('div', { ...props, 'data-testid': 'mocked-ui-content' }, props.children),
        Navbar: (props: any) => React.createElement('div', { ...props, 'data-testid': 'mocked-ui-navbar' }, props.children),
        Sidebar: (props: any) => {
            lastSidebarProps = props;
            return React.createElement('div', { ...props, 'data-testid': 'mocked-ui-sidebar', 'data-open': props.isSidebarOpen }, props.children)
        },
    }
});

import React from 'react';

import '@testing-library/jest-dom'
import { act, cleanup, render, screen } from '@testing-library/react';

import { menuMock } from '../../mocks';

import Page from './Page';

describe('<Page/>', () => {
    beforeEach(() => {
        (global as any).useBreakpointMock.mockImplementation(() => ({ isMobile: false }));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const defaultProps = {
        children: <div>main-children</div>,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Page {...defaultProps} {...props}/>);
    }

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-page');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-page');
        const content = screen.getByTestId('mocked-ui-content');
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent('main-children');
        expect(screen.queryByTestId('mocked-ui-navbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mocked-ui-sidebar')).not.toBeInTheDocument();
    });

    it('should render navigation bar (default title) and authenticated sidebar and menu present.', () => {
        renderComponent({
            isAuthenticated: true,
            menu: [{ label: 'menu1', path: '/menu1' }],
            userName: 'username',
        });
        expect(screen.getByTestId('mocked-ui-navbar')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ui-sidebar')).toBeInTheDocument();
    });

    it('should accept custom navbarTitle.', () => {
        renderComponent({ isAuthenticated: true, navbarTitle: 'Dash', menu: [] });
        const navbarComponent = screen.getByTestId('mocked-ui-navbar');
        expect(navbarComponent).toBeInTheDocument();
        expect(navbarComponent.title).toEqual('Dash');
    });

    it('Navbar receives userName.', () => {
        renderComponent({ isAuthenticated: true, userName: 'Maria', menu: [] });
        const navbarComponent = screen.getByTestId('mocked-ui-navbar');
        expect(navbarComponent).toBeInTheDocument();
        expect(navbarComponent.title).toEqual('My App');
    });

    it('does not render Sidebar if menu is missing, even if authenticated', () => {
        (global as any).useBreakpointMock.mockImplementation(() => ({ isMobile: true }));
        renderComponent({ isAuthenticated: true });
        expect(screen.getByTestId('mocked-ui-navbar')).toBeInTheDocument();
        expect(screen.queryByTestId('mocked-ui-sidebar')).not.toBeInTheDocument();
    });

    it('must propagate Content props: title, ariaLabel, isSidebarOpen, withAnimation.', () => {
        renderComponent({
            isAuthenticated: true,
            menu: [],
            title: 'TITLE',
            ariaLabel: 'ariaLabel',
            sidebarOpen: true,
            withAnimation: false,
        });
        const contentComponent = screen.getByTestId('mocked-ui-content');
        expect(contentComponent).toBeInTheDocument();
        expect(contentComponent.title).toEqual('TITLE');
    });

    it('controle do Sidebar: handleSidebarToggle altera isSidebarOpen', async () => {
        renderComponent({ isAuthenticated: true, menu: menuMock, sidebarOpen: true });
        expect(screen.getByTestId('mocked-ui-sidebar').getAttribute('data-open')).toBe('true');
        expect(lastSidebarProps.isSidebarOpen).toBe(true);

        await act(async () => {
            lastSidebarProps.onToggle(false);
        });


        expect(screen.getByTestId('mocked-ui-sidebar').getAttribute('data-open')).toBe('false');
    });

});