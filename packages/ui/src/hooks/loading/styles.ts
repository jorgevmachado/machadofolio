import { CSSProperties } from 'react';

const STYLE: CSSProperties = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    position: 'fixed',
}

const STYLE_BLUR: CSSProperties = {
    background: 'rgba(0,0,0,0.18)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',

}

export const STYLE_DEFAULT: CSSProperties = {
    ...STYLE,
    ...STYLE_BLUR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

export const STYLE_BAR: CSSProperties = {
    ...STYLE,
    ...STYLE_BLUR,
    pointerEvents: 'none',
};

export const STYLE_BAR_TOP: CSSProperties = {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10001,
    position: 'fixed',
};