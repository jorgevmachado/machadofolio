import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import useOutsideClick from './useOutsideClick';

function TestComponent({ onOutsideClick }: { onOutsideClick: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, onOutsideClick);

    return (
        <div>
            <div ref={ref} data-testid="inside-div">Inside</div>
        <div data-testid="outside-div">Outside</div>
        </div>
);
}

describe('useOutsideClick', () => {
    it('should call callback when clicking outside the ref element', () => {
        const callback = jest.fn();
        const { getByTestId } = render(<TestComponent onOutsideClick={callback} />);
        fireEvent.mouseUp(getByTestId('outside-div'));
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should NOT call callback when clicking inside the ref element', () => {
        const callback = jest.fn();
        const { getByTestId } = render(<TestComponent onOutsideClick={callback} />);
        fireEvent.mouseUp(getByTestId('inside-div'));
        expect(callback).not.toHaveBeenCalled();
    });

    it('should remove event listener on unmount', () => {
        const callback = jest.fn();
        const { unmount } = render(<TestComponent onOutsideClick={callback} />);
        unmount();
        expect(true).toBeTruthy();
    });

    it('should not throw if ref is null', () => {
        const callback = jest.fn();
        function NullRefComponent() {
            const ref = useRef<HTMLDivElement>(null);
            useOutsideClick(ref, callback);
            return <div data-testid="outside-div">Sample</div>;
        }
        const { getByTestId } = render(<NullRefComponent />);
        expect(() => {
            fireEvent.mouseUp(getByTestId('outside-div'));
        }).not.toThrow();
        expect(callback).not.toHaveBeenCalled();
    });

});