import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('../../assets/base64', () =>({
    LAW_LOGO_BASE64: 'base64-image-law',
    GEEK_LOGO_BASE64: 'base64-image-geek',
    FINANCE_LOGO_BASE64: 'base64-image-finance',
    NOTFOUND_IMAGE_BASE64: 'base64-image-notfound',
}))


jest.mock('../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

const mockUseActiveBrand = jest.fn();
jest.mock('../../hooks', () => ({
    useActiveBrand: () => mockUseActiveBrand(),
}));

jest.mock('../icon', () => ({
    __esModule: true,
    default: ({ children }: any) => (<div data-testid="mock-icon" className="ds-image__fallback--icon">{children}</div>),
    Icon: ({ children }: any) => (<div data-testid="mock-icon" className="ds-image__fallback--icon">{children}</div>),
}));

import Image from './Image';

describe('<Image/>', () => {
    const defaultProps = {
        src: 'https://img.com/pic.png'
    };

    const renderComponent = (props: any = {}) => {
        return render(<Image {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('type="standard"', () => {
        it('should render component type standard with props default.', () => {
            renderComponent();
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
        });

        it('should apply the custom className when provided', () => {
            renderComponent({ className: 'custom-class' });
            expect(screen.getByTestId('ds-image')).toHaveClass('custom-class');
        });

        it('should set the alt attribute correctly in "img"', () => {
            renderComponent({ alt: 'sample alt' });
            expect(screen.getByTestId('ds-image')).toHaveAttribute('alt', 'sample alt');
        });

        it('should forward other img HTML attributes to the img', () => {
            renderComponent({ width: 111, height: 222 });
            const component = screen.getByTestId('ds-image');
            expect(component).toHaveAttribute('width', '111');
            expect(component).toHaveAttribute('height', '222');
            expect(component).toHaveAttribute('src', defaultProps.src);
        });

        it('should apply the correct fit class when the "fit" prop is provided', () => {
            renderComponent({ fit: 'cover' });
            expect(screen.getByTestId('ds-image')).toHaveClass('ds-image__fit-cover');
        });

        it('should set loading="lazy" when lazyLoad is true', () => {
            renderComponent({ lazyLoad: true });
            expect(screen.getByTestId('ds-image')).toHaveAttribute('loading', 'lazy');
        });

        it('should not set loading attribute when lazyLoad is false and loading is not provided', () => {
            renderComponent();
            expect(screen.getByTestId('ds-image')).not.toHaveAttribute('loading');
        });

        it('should have aria-label in fallback when alt is not provided', () => {
            renderComponent({ src: undefined, fallback: true });
            const fallbackContainer = screen.getByLabelText('Image failed to load');
            expect(fallbackContainer).toBeInTheDocument();
        });

        it('should set aria-label in fallback as alt when provided', () => {
            renderComponent({ src: undefined, fallback: true, alt: 'descrição da imagem' });
            const fallbackContainer = screen.getByLabelText('descrição da imagem');
            expect(fallbackContainer).toBeInTheDocument();
        });

        it('should correctly update when src changes from valid to invalid and show fallback', async () => {
            const { rerender } = render(<Image {...defaultProps} fallback={<div data-testid="fb">FB</div>} data-testid="ds-image" />);
            expect(screen.getByTestId('ds-image')).toBeInTheDocument();
            rerender(<Image fallback={<div data-testid="fb">FB</div>} data-testid="ds-image" />);
            await waitFor(() => {
                expect(screen.getByTestId('fb')).toBeInTheDocument();
            });

        });

        it('should render fallback element when src is not provided and fallback is passed', () => {
            renderComponent({ src: undefined, fallback: <div data-testid="fallback-div">fallback</div> });
            const fallback = screen.getByTestId('fallback-div');
            expect(fallback).toBeInTheDocument();
            expect(screen.queryByTestId('ds-image')).not.toBeInTheDocument();
        });

        it('should render fallback icon when src is not provided and fallback={true}', () => {
            renderComponent({ src: undefined, fallback: true });
            const fallbackIcon = screen.getByLabelText(/Image failed to load/i).querySelector('.ds-image__fallback--icon');
            expect(fallbackIcon).toBeInTheDocument();
        });

        it('should render fallback when image loading fails and fallback is passed', () => {
            renderComponent({ src: 'broken-src', fallback: <div data-testid="fal">error</div> });
            const img = screen.getByTestId('ds-image');
            fireEvent.error(img);
            expect(screen.getByTestId('fal')).toBeInTheDocument();
            expect(screen.getByTestId('ds-image-fallback')).toBeInTheDocument();
        });

        it('should call the onError prop if the image fails to load', () => {
            const onError = jest.fn();
            renderComponent({ src: 'broken-src', onError });
            const img = screen.getByTestId('ds-image');
            fireEvent.error(img);
            expect(onError).toHaveBeenCalledTimes(1);
        });

    });

    describe('type="notfound"', () => {
        it('should render component type notfound with props default.',  async () => {
            renderComponent({ src: undefined, type: 'notfound'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', 'base64-image-notfound');
            });
        });

        it('should render component type notfound with src.',  async () => {
            renderComponent({ type: 'notfound'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', defaultProps.src);
            });
        });
    });

    describe('type="brand"', () => {
        it('should render component type brand when dont found brand.',  async () => {
            mockUseActiveBrand.mockReturnValue(undefined);
            renderComponent({ src: undefined, type: 'brand'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', 'base64-image-notfound');
            });
        });

        it('should render component type brand with src.',  async () => {
            renderComponent({ type: 'brand'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', defaultProps.src);
            });
        });

        it('should render component type brand equal law.',  async () => {
            mockUseActiveBrand.mockReturnValue('law');
            renderComponent({ src: undefined, type: 'brand'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', 'base64-image-law');
            });
        });

        it('should render component type brand equal geek.',  async () => {
            mockUseActiveBrand.mockReturnValue('geek');
            renderComponent({ src: undefined, type: 'brand'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', 'base64-image-geek');
            });
        });

        it('should render component type brand equal finance.',  async () => {
            mockUseActiveBrand.mockReturnValue('finance');
            renderComponent({ src: undefined, type: 'brand'});
            const component = screen.getByTestId('ds-image');
            expect(component).toBeInTheDocument();
            expect(component.tagName).toBe('IMG');
            expect(component).toHaveClass('ds-image');
            await waitFor(() => {
                expect(component).toHaveAttribute('src', 'base64-image-finance');
            });
        });
    });
});