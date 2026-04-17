import type React from 'react';

import type { TIcon } from '@repo/ds';

export type TRoute = {
    key: string;
    icon?: TIcon;
    path: string;
    type: 'public' | 'private';
    name?: string;
    title: string;
    element?: React.ReactElement;
    children?: Array<TRoute>;
}