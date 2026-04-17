import React, { type CSSProperties, useEffect, useState } from 'react';

import type { TDirection } from '../types';

export interface SlideProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    enter?: boolean;
    delay?: number;
    timeout?: number;
    children?: React.ReactNode;
    direction?: TDirection;
    transitionType?: string;
}

const styledShow = (
    timeout: number,
    transitionType: string,
): CSSProperties => ({
    opacity: 1,
    transform: '',
    transition: `${transitionType} ${timeout}s ease-in-out`,
});

const styledHide = (
    timeout: number,
    direction: TDirection,
    transitionType: string,
): CSSProperties => {
    const translate = {
        top: 'translateY(-10px)',
        left: 'translateX(-10px)',
        right: 'translateX(10px)',
        bottom: 'translateY(10px)',
    };
    return {
        opacity: 0,
        transform: translate[direction],
        transition: `${transitionType} ${timeout}s ease-in-out`,
    }
};


export default function Slide({
    enter = true,
    delay = 50,
    timeout = 0.2,
    children = null,
    direction = 'right',
    transitionType = 'all',
    ...props
}: SlideProps) {
    const [animationStyle, setAnimationStyle] = useState<CSSProperties>(
        styledHide(timeout, direction, transitionType),
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStyle(
                enter
                    ? styledShow(timeout, transitionType)
                    : styledHide(timeout, direction, transitionType),
            );
        }, delay);
        return () => clearTimeout(timer);
    }, [enter, delay, timeout, transitionType, direction]);

    return (
        <div {...props} style={animationStyle} data-testid="ui-slide">
            {children}
        </div>
    )
}