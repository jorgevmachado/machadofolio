import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Header from './Header';

describe('<Header/>', () => {
    const logoMock = {
        src: 'https://placehold.co/150',
        alt: 'logo',
        title: 'logo',
        width: 80,
        height: 60,
        onClick: jest.fn(),
    };
    const navbarMock = [
        {
            key: 'about',
            label: 'Page',
            onRedirect: jest.fn(),
        },
        {
            key: 'options',
            label: 'Options',
            items: [
                {
                    key: 'option1',
                    label: 'Option 1',
                    onRedirect: jest.fn(),
                },
                {
                    key: 'option2',
                    label: 'Option 2',
                    onRedirect: jest.fn(),
                },
            ],
        },
        {
            key: 'help',
            label: 'Help',
            onRedirect: jest.fn(),
        },
    ];

    const defaultProps = {
        logo: logoMock,
        navbar: navbarMock,
        context: 'primary',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Header {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render the wrapper with the base class and data-testid.', () => {
        renderComponent();
        const component = screen.getByTestId('ui-header');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ui-header');
        const linkComponents = screen.getAllByTestId('mocked-ds-link');
        expect(linkComponents).toHaveLength(3);
        expect(screen.getByTestId('mocked-ds-image')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-ds-dropdown')).toBeInTheDocument();
    });

    it('should render with the correct context modifier class', () => {
        renderComponent({ context: 'primary' });
        expect(screen.getByTestId('ui-header')).toHaveClass('ui-header__context--primary');
    });

    it('should call handleToggleMenu when menu button is clicked', () => {
        const handleToggleMenu = jest.fn();
        renderComponent({ handleToggleMenu });
        const button = screen.getByLabelText('Toggle menu');
        fireEvent.click(button);
        expect(handleToggleMenu).toHaveBeenCalled();
    });

    it('should render logo with correct src, alt and title', () => {
        renderComponent();
        const img = screen.getByTestId('mocked-ds-image');
        expect(img).toHaveAttribute('src', logoMock.src);
        expect(img).toHaveAttribute('alt', logoMock.alt);
        expect(img).toHaveAttribute('title', logoMock.title);
    });

    it('should call logo.onClick when logo wrapper is clicked', () => {
        renderComponent();
        const logoWrapper = screen.getByRole('button', { name: /go to home page/i });
        fireEvent.click(logoWrapper);
        expect(logoMock.onClick).toHaveBeenCalled();
    });

    it('should respect tabIndex and aria-label for logo wrapper', () => {
        renderComponent();
        const logoWrapper = screen.getByRole('button', { name: /go to home page/i });
        expect(logoWrapper).toHaveAttribute('tabIndex', '0');
        expect(logoWrapper).toHaveAttribute('aria-label', 'Go to home page');
    });

    it('should render navbar items and call onRedirect for simple link', () => {
        renderComponent();
        const link = screen.getAllByTestId('mocked-ds-link').find(node => node.textContent === 'Page');
        fireEvent.click(link!);
        expect(navbarMock?.[0]?.onRedirect).toHaveBeenCalled();
    });

    it('should render dropdown for item with subitems', () => {
        renderComponent();
        const dropdown = screen.getByTestId('mocked-ds-dropdown');
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveTextContent('Options');
        fireEvent.click(dropdown);
        const submenu = screen.getAllByTestId('mocked-ds-link');
        expect(submenu[2]).toHaveTextContent('Option 1');
        expect(submenu[3]).toHaveTextContent('Option 2');
    });

    it('should call onRedirect for dropdown subitem click', () => {
        renderComponent();
        const dropdown = screen.getByTestId('mocked-ds-dropdown');
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveTextContent('Options');
        fireEvent.click(dropdown);
        const submenu = screen.getAllByTestId('mocked-ds-link').filter(node => node.textContent === 'Option 1');
        if(submenu?.[0]) {
            fireEvent.click(submenu[0]);
            expect(navbarMock[1]?.items?.[0]?.onRedirect).toHaveBeenCalled();
        }
    });

    it('should render multiple items and handle last simple link', () => {
        renderComponent();
        const helpLink = screen.getAllByTestId('mocked-ds-link').find(node => node.textContent === 'Help');
        fireEvent.click(helpLink!);
        expect(navbarMock?.[2]?.onRedirect).toHaveBeenCalled();
    });

    it('should render only logo and not fail if navbar is empty', () => {
        render(<Header logo={logoMock} navbar={[]} />);
        expect(screen.getByTestId('mocked-ds-image')).toBeInTheDocument();
        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
        expect(screen.queryByRole('menu')).toBeInTheDocument();
    });

    it('should render header with only navbar if logo is not provided', () => {
        render(<Header navbar={navbarMock} />);
        expect(screen.queryByTestId('mocked-ds-image')).not.toBeInTheDocument();
        expect(screen.getAllByTestId('mocked-ds-link').length).toBeGreaterThan(0);
    });

    it('should render header with default context when not provided', () => {
        render(<Header logo={logoMock} navbar={navbarMock} />);
        expect(screen.getByTestId('ui-header')).toHaveClass('ui-header__context--neutral');
    });

    it('should respect accessibility attributes on navigation', () => {
        renderComponent();
        const nav = screen.getByRole('navigation', { name: 'main navigation' });
        expect(nav).toBeInTheDocument();
        const ul = screen.getByRole('menu');
        expect(ul).toHaveClass('ui-header__nav--list');
    });

    it('should not break if called without logo and navbar', () => {
        render(<Header />);
        expect(screen.getByTestId('ui-header')).toBeInTheDocument();
    });
});