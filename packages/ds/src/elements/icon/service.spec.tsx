import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react';

import { getIcon } from './service';

jest.mock('./groups', () => {
    const DummyIcon = ({ size, color }: any) => <span data-testid="dummy-icon">{`${size || "1em"}-${color || "default"}`}</span>;
    const icons = {
        react: DummyIcon,
        tv: DummyIcon,
        box: {},
        key: 7,
        exit: undefined,
    };

    return {
        __esModule: true,
        ciGroup: { ...icons, star: DummyIcon },
        faGroup: { ...icons },
        fa6Group: { ...icons },
        giGroup: { ...icons },
        ioGroup: { ...icons },
        io5Group: { ...icons },
        mdGroup: { ...icons },
        vscGroup: { ...icons },
        type: {},
        TIconGroups: {},
    };
});


describe('service', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should return icon with default props successfully.', () => {
        const result = getIcon({ name: 'react' });
        expect(result.icon).toBeTruthy();
        expect(result.group).toBe('fa');
    });

    it('should return an icon when providing a specific group', () => {
        const result = getIcon({ name: 'react', group: 'ci' });
        expect(result.icon).toBeTruthy();
        expect(result.group).toBe('ci');
    });

    it('should render the component with custom props (size/color)', () => {
        const result = getIcon({ name: 'tv', size: 32, color: 'info-40', group: 'fa' });
        const { container } = render(<>{result.icon}</>);
        expect(container.querySelector('[data-testid="dummy-icon"]')).toHaveTextContent('32-info-40');
    });

    it('should search in all groups when the icon does not exist in the provided group', () => {
        const result = getIcon({ name: 'react', group: 'vsc' });
        expect(result.icon).toBeTruthy();
        expect(['ci', 'fa', 'fa6', 'gi', 'io', 'io5', 'md', 'vsc']).toContain(result.group);
    });

    it('should return undefined if the icon does not exist in any group and withDefault is false', () => {
        const result = getIcon({ name: 'exit', group: 'fa', withDefault: false });
        expect(result.icon).toBeUndefined();
        expect(result.group).toBeUndefined();
    });

    it('should return undefined if the icon does not exist in the default group', () => {
        const result = getIcon({ name: 'exit', group: undefined, withDefault: false });
        expect(result.icon).toBeUndefined();
        expect(result.group).toBeUndefined();
    });

    it('should return the icon if it exists in any group when default group is not specified', () => {
        const result = getIcon({ name: 'star', group: undefined, withDefault: false });
        expect(result.icon).toBeTruthy();
        expect(result.group).toEqual('ci');
    });

    it('should return the default icon if the icon does not exist in any group and withDefault is true', () => {
        const result = getIcon({ name: 'exit', group: 'fa', withDefault: true });
        expect(result.icon).toBeTruthy();
        expect(result.group).toBe('fa');
    });

    it('getIconByGroup: should return correctly for withDefault = false', () => {
        const result = getIcon({ name: 'exit', group: 'fa', withDefault: false });
        expect(result.icon).toBeUndefined();
        expect(result.group).toBeUndefined();
    });

    it('getIconByDefaultGroup: should return correctly when the icon exists', () => {
        const result = getIcon({ name: 'react' });
        expect(result.icon).toBeTruthy();
        expect(result.group).toBe('fa');
    });

        it('buildWithCustomProps: should return a valid element.', () => {
            const spy = jest.spyOn(React, 'isValidElement').mockImplementation(() => true);
            const result = getIcon({ name: 'tv' });
            expect(result.icon).toBeTruthy();
            spy.mockRestore();
        });


    it('buildWithCustomProps: should return a valid element with type object.', () => {
        const result = getIcon({ name: 'box' });
        expect(result.icon).toBeTruthy();
    });

    it('buildWithCustomProps: should return a element when this is not function or object.', () => {
        const result = getIcon({ name: 'key' });
        expect(result.icon).toBeTruthy();
    });


});