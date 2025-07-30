import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../utils', () => {
    const actual = jest.requireActual('../../utils');
    return {
        ...actual,
        EInputContentChildren: {
            PREPEND: 'PREPEND',
            CALENDAR: 'CALENDAR',
            APPEND: 'APPEND',
            ICON_LEFT: 'ICON_LEFT',
            ICON_RIGHT: 'ICON_RIGHT',
            COUNTER: 'COUNTER',
            ADDON: 'ADDON',
        },
        useChildrenElements: jest.fn(),
        __esModule: true
    }
});

jest.mock('../../elements', () => ({
    Text: (props: any) => (<p {...props} data-testid="mock-text">{props.children}</p>),
}));

import { useChildrenElements } from '../../utils';

import { InputProvider, useInput } from './InputContext';

function setupProvider(props: any = {}) {
    let contextValue: any = undefined;
    function TestComponent() {
        contextValue = useInput();
        return null;
    }
    render(
        <InputProvider {...props}>
            <TestComponent />
        </InputProvider>
    );
    return contextValue;
}

describe('InputContext', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should provide defaults when no children elements are present', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div /> });

        expect(context.hasIcon('left')).toBeFalsy();
        expect(context.hasIcon('right')).toBeFalsy();
        expect(context.hasAddon).toBeFalsy();
        expect(context.hasAppend).toBeFalsy();
        expect(context.hasCalendar).toBeFalsy();
        expect(context.hasPrepend).toBeFalsy();
        expect(context.hasCounter).toBeFalsy();
        expect(context.hasIconLeft).toBeFalsy();
        expect(context.hasIconRight).toBeFalsy();
        expect(context.addonElement).toBeFalsy();
        expect(context.appendElement).toBeUndefined();
        expect(context.prependElement).toBeUndefined();
        expect(context.counterElement).toBeFalsy();
        expect(context.calendarElement).toBeUndefined();
        expect(context.iconLeftElement).toBeUndefined();
        expect(context.iconRightElement).toBeUndefined();
    });

    it('should return true for left icon if icon is provided and position is left or undefined', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIcon('left', { icon: 'foo' })).toBe(true);
        expect(context.hasIcon('left', { icon: 'foo', position: 'left' })).toBe(true);
        expect(context.hasIcon('left', { icon: 'foo', position: undefined })).toBe(true);
        expect(context.hasIcon('left', { icon: 'foo', position: 'right' })).toBe(false);
    });

    it('should return true for right icon if icon is provided and position is right', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIcon('right', { icon: 'foo', position: 'right' })).toBe(true);
        expect(context.hasIcon('right', { icon: 'foo', position: 'left' })).toBe(false);
        expect(context.hasIcon('right', { icon: 'foo' })).toBe(false);
    });

    it('should recognize children elements for all positions', () => {
        const getChildrenElement = jest.fn((key) => {
            return <div>{key}</div>;
        });
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement,
            childrenElements: {
                PREPEND: true,
                APPEND: true,
                CALENDAR: true,
                ICON_LEFT: true,
                ICON_RIGHT: true,
                COUNTER: true,
                ADDON: true,
            },
        });

        const context = setupProvider({ value: <div />, children: <div /> });

        expect(context.hasPrepend).toBe(true);
        expect(context.prependElement).toBeTruthy();

        expect(context.hasAppend).toBe(true);
        expect(context.appendElement).toBeTruthy();

        expect(context.hasCalendar).toBe(true);
        expect(context.calendarElement).toBeTruthy();

        expect(context.hasIconLeft).toBe(true);
        expect(context.iconLeftElement).toBeTruthy();

        expect(context.hasIconRight).toBe(true);
        expect(context.iconRightElement).toBeTruthy();

        expect(context.counterElement).toBeTruthy();
        expect(context.addonElement).toBeTruthy();
    });

    it('should return true for hasIconElement if icon is present or elements are in their positions', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });
        let context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('left', { icon: 'foo' })).toBe(true);
        expect(context.hasIconElement('right', { icon: 'foo', position: 'right' })).toBe(true);

        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: { ICON_LEFT: true, ICON_RIGHT: true },
        });
        context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('left')).toBe(true);
        expect(context.hasIconElement('right')).toBe(true);
    });

    it('should render Text element when addon is provided', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div />, addon: { children: 'addon!' } });
        expect(context.addonElement).toBeDefined();
    });

    it('should render Text element when counter is provided', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div />, counter: { children: 'counter!' } });
        expect(context.counterElement).toBeDefined();
    });

    it('should return true if hasIcon(position, icon) is true (left)', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('left', { icon: 'iconLeft', position: 'left' })).toBe(true);
        expect(context.hasIconElement('left', { icon: 'iconLeft', position: 'right' })).toBe(false);
    });

    it('should return true if hasIcon(position, icon) is true (right)', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('right', { icon: 'iconRight', position: 'right' })).toBe(true);
        expect(context.hasIconElement('right', { icon: 'iconRight', position: 'left' })).toBe(false);
    });

    it('should return true if hasIconLeft is true and position is left, even que icon não bata', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {
                ICON_LEFT: true,
            },
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('left', { icon: 'foo', position: 'wrong-pos' })).toBe(true);
    });

    it('should return true if hasIconRight is true and position is right, mesmo para icon errado', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {
                ICON_RIGHT: true,
            },
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('right', { icon: 'foo', position: 'left' })).toBe(true);
    });

    it('should return false if neither icon nor children element exists', () => {
        (useChildrenElements as jest.Mock).mockReturnValue({
            getChildrenElement: jest.fn(),
            childrenElements: {},
        });

        const context = setupProvider({ value: <div />, children: <div /> });
        expect(context.hasIconElement('left', undefined)).toBe(false);
        expect(context.hasIconElement('right', undefined)).toBe(false);
    });

    it('deve retornar o valor default do contexto quando usado fora do provider', () => {
        let contextValue: any;
        function Consumer() {
            contextValue = useInput();
            return null;
        }
        render(<Consumer />);
        expect(contextValue.hasIcon('left')).toBe(false);
        expect(contextValue.hasIcon('right')).toBe(false);
        expect(contextValue.hasIconElement('right')).toBe(false);
    });



});