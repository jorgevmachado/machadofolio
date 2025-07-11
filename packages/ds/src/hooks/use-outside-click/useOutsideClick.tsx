import { type RefObject, useEffect } from 'react';

export default function useOutsideClick(
    ref: RefObject<HTMLElement | null>,
    callback: () => void,
    deps: any[] = [],
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref && ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener('mouseup', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [ref, callback, ...deps]);
}
