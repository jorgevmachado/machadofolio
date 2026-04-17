import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import useChildrenElements from './childrenELements';

describe('useChildrenElements', () => {
    const getSampleChild = (key: string, otherProps?: object) =>
        React.createElement('div', { 'data-children': key, ...otherProps }, key);

    it('returns a childrenElements object with all valid children mapped by data-children', () => {
        const children = [
            getSampleChild('foo'),
            getSampleChild('bar', { tabIndex: 1 }),
            React.createElement('span', null, 'no-key')
        ];
        const { result } = renderHook(() => useChildrenElements(children));

        expect(Object.keys(result.current.childrenElements)).toEqual(['foo', 'bar']);
    });

    it('can obtain an element by the correct ID via getChildrenElement', () => {
        const children = [
            getSampleChild('a'),
            getSampleChild('b')
        ];
        const { result } = renderHook(() => useChildrenElements(children));
        const elem = result.current.getChildrenElement('a');

        expect(React.isValidElement(elem)).toBe(true);

        if (React.isValidElement<{ 'data-children': string }>(elem)) {
            expect(elem.props['data-children']).toBe('a');
        }
    });

    it('returns null for a nonexistent id in getChildrenElement', () => {
        const children = [getSampleChild('x')];
        const { result } = renderHook(() => useChildrenElements(children));
        expect(result.current.getChildrenElement('nonexistent')).toBeNull();
    });

    it('does not add elements that do not have the data-children prop', () => {
        const children = [
            React.createElement('span', null, 'no-key'),
            React.createElement('div', { 'data-children': '' }, 'empty'),
            getSampleChild('with-key')
        ];
        const { result } = renderHook(() => useChildrenElements(children));
        expect(Object.keys(result.current.childrenElements)).toEqual(['with-key']);
    });

    it('returns an empty object if there are no children', () => {
        const { result } = renderHook(() => useChildrenElements(undefined));
        expect(result.current.childrenElements).toEqual({});
    });

    it('keeps the memoization of childrenElements when receiving the same children', () => {
        const children = [
            getSampleChild('m1'),
            getSampleChild('m2')
        ];
        const { result, rerender } = renderHook(({ c }) => useChildrenElements(c), { initialProps: { c: children } });

        const first = result.current.childrenElements;
        rerender({ c: children });
        const after = result.current.childrenElements;

        expect(first).toBe(after);
    });

    it('updates childrenElements if the children change (recreates the object)', () => {
        const c1 = [getSampleChild('aa')];
        const c2 = [getSampleChild('bb')];
        const { result, rerender } = renderHook(({ c }) => useChildrenElements(c), { initialProps: { c: c1 } });

        const before = result.current.childrenElements;
        rerender({ c: c2 });
        const after = result.current.childrenElements;

        expect(before).not.toBe(after);
        expect(Object.keys(after)).toEqual(['bb']);
    });
});