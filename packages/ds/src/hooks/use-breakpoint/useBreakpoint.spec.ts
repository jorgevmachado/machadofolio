import { act, renderHook } from '@testing-library/react-hooks';
import useBreakpoint from './useBreakpoint';

const createMatchMedia = (matchesMap: Record<string, boolean>) => {
    return (query: string) => ({
        matches: matchesMap[query],
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    });
};

describe('useBreakpoint', () => {
    let originalMatchMedia: typeof window.matchMedia | undefined;

    beforeAll(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterAll(() => {
        window.matchMedia = originalMatchMedia!;
    });

    it('should warn if used outside the browser', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const originalWindow = global.window;
        delete (global as any).window;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBeUndefined();
        expect(result.current.isMobile).toBe(false);
        expect(warn).toHaveBeenCalledWith(
            'useBreakpoint: Hook being used outside of a browser environment.',
        );

        warn.mockRestore();
        (global as any).window = originalWindow;
    });

    it('must detect mobile device correctly', () => {
        window.matchMedia = createMatchMedia({
            '(max-width: 719px)': true,
        }) as any;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('mobile');
        expect(result.current.isMobile).toBe(true);
    });

    it('should detect tablet device correctly', () => {
        window.matchMedia = createMatchMedia({
            '(max-width: 719px)': false,
            '(min-width: 720px) and (max-width: 1023px)': true,
        }) as any;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('tablet');
        expect(result.current.isMobile).toBe(false);
    });

    it('should detect desktop device correctly', () => {
        window.matchMedia = createMatchMedia({
            '(min-width: 1024px) and (max-width: 1279px)': true,
        }) as any;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('desktop');
        expect(result.current.isMobile).toBe(false);
    });

    it('should detect widescreen device correctly', () => {
        window.matchMedia = createMatchMedia({
            '(min-width: 1280px) and (max-width: 1439px)': true,
        }) as any;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('widescreen');
        expect(result.current.isMobile).toBe(false);
    });

    it('should detect full-hd device correctly', () => {
        window.matchMedia = createMatchMedia({
            '(min-width: 1440px)': true,
        }) as any;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('full-hd');
        expect(result.current.isMobile).toBe(false);
    });

    it('should return desktop by default if no match', () => {
        window.matchMedia = createMatchMedia({}) as any;

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('desktop');
        expect(result.current.isMobile).toBe(false);
    });

    it('must be reactive when triggering a change event', () => {
        const handlers: { [k: string]: (() => void)[] } = {};
        // Simula objects MediaQueryList e mocks de listeners
        window.matchMedia = ((query: string) => {
            return {
                matches: query === '(max-width: 719px)',
                media: query,
                addEventListener: (_: string, cb: () => void) => {
                    handlers[query] = handlers[query] || [];
                    handlers[query].push(cb);
                },
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            };
        }) as any;
        const { result } = renderHook(() => useBreakpoint());
        expect(result.current.breakpoint).toBe('mobile');
        expect(result.current.isMobile).toBe(true);

        // Agora simula mudança para desktop
        window.matchMedia = ((query: string) => {
            return {
                matches: query === '(min-width: 1024px) and (max-width: 1279px)',
                media: query,
                addEventListener: (_: string, cb: () => void) => {
                    handlers[query] = handlers[query] || [];
                    handlers[query].push(cb);
                },
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            };
        }) as any;


        act(() => {
            Object.values(handlers).forEach(queue =>
                queue.forEach(fn => fn())
            );
        });
    });
});