import React, { createContext, useCallback, useState } from 'react';

import { Spinner } from '@repo/ds';

import { STYLE_BAR, STYLE_BAR_TOP, STYLE_DEFAULT } from './styles';

type SpinnerProps = React.ComponentProps<typeof Spinner>;

type LoadingContextProps = {
    show: (props?: SpinnerProps) => void;
    hide: () => void;
    isLoading: boolean;
    spinnerProps?: SpinnerProps;
}

const LoadingContext = createContext<LoadingContextProps>({
    show: () => {},
    hide: () => {},
    isLoading: false,
    spinnerProps: {},
});

type LoadingProviderProps = {
    children: React.ReactNode;
    defaultSpinnerProps?: SpinnerProps;
}

export function LoadingProvider({ children, defaultSpinnerProps }: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [spinnerProps, setSpinnerProps] = useState<SpinnerProps | undefined>(defaultSpinnerProps);

    const show = useCallback((props?: SpinnerProps) => {
        setSpinnerProps(props || defaultSpinnerProps);
        setIsLoading(true);
    }, [defaultSpinnerProps]);

    const hide = useCallback(() => {
        setIsLoading(false);
    }, []);


    const context: LoadingContextProps = {
        show,
        hide,
        isLoading,
        spinnerProps,
    }

    const spinnerType = spinnerProps?.type ?? 'circle';
    const isSpinnerTypeBar = spinnerType === 'bar';

    return (
        <LoadingContext.Provider value={context}>
            {children}
            {isLoading && isSpinnerTypeBar && (
                <>
                    <div style={STYLE_BAR} aria-hidden="true" />
                    <div style={STYLE_BAR_TOP}>
                        <Spinner {...spinnerProps}/>
                    </div>
                </>
            )}
            {isLoading && !isSpinnerTypeBar && (
                <div style={STYLE_DEFAULT}>
                    <Spinner {...spinnerProps}/>
                </div>
            )}

        </LoadingContext.Provider>
    )
}

export function useLoading() {
    const { show, hide, isLoading, spinnerProps } = React.useContext(LoadingContext);
    return { show, hide, isLoading, spinnerProps };
}