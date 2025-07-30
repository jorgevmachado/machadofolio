import React from 'react';

import { joinClass } from '../../../../utils';

import { useInput } from '../../InputContext';

import './Addon.scss';

type AddonsProps = {
    show?: boolean;
    position: 'left' | 'right';
}

export default function Addon({ show = true, position }: AddonsProps) {
    const { hasAddon, hasAppend, hasPrepend, addonElement, appendElement, prependElement } = useInput();
    const isPrepend = position === 'left' && hasPrepend;

    const isAddon = position === 'right' && hasAddon;

    const isAppend = position === 'right' && hasAppend;

    const hasChildren = isPrepend || isAddon || isAppend;

    if (!hasChildren || !show) {
        return null;
    }

    const classNameList = joinClass(['' +
        'ds-addon',
        isPrepend && 'ds-addon__prepend',
        isAddon && !isAppend && 'ds-addon__content',
        isAppend && 'ds-addon__append',
    ])

    return (
        <div className={classNameList} data-testid="ds-addon">
            {isPrepend && prependElement}
            {isAddon && !isAppend && addonElement}
            {isAppend && appendElement}
        </div>
    );
}