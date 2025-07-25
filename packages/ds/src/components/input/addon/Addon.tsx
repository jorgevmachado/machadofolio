import React, { type ComponentProps } from 'react';

import { EInputContentChildren, joinClass, useChildrenElements } from '../../../utils';
import { Text } from '../../../elements';

import './Addon.scss';

type AddonProps = {
    addon?: ComponentProps<typeof Text>;
    children: React.ReactNode;
    position: 'left' | 'right';
};

export default function Addon({ addon, children, position }: AddonProps) {

    const { getChildrenElement, childrenElements } = useChildrenElements(children);

    const isPrepend = position === 'left' && Boolean(childrenElements[EInputContentChildren.PREPEND]);
    const prependElement = getChildrenElement(EInputContentChildren.PREPEND);

    const addonElement = addon
        ? (<Text {...addon}/>)
        : getChildrenElement(EInputContentChildren.ADDON);
    const hasAddon = position === 'right' && Boolean(addonElement);

    const isAppend = position === 'right' && Boolean(childrenElements[EInputContentChildren.APPEND]);
    const appendElement = getChildrenElement(EInputContentChildren.APPEND);

    const hasChildren = isPrepend || hasAddon || isAppend;

    if(!hasChildren) {
        return null;
    }

    const classNameList = joinClass(['' +
        'ds-addon',
        isPrepend && 'ds-addon__prepend',
        hasAddon && !isAppend && 'ds-addon__content',
        isAppend && 'ds-addon__append',
    ])

    return (
        <div className={classNameList} data-testid="ds-addon">
            {isPrepend && prependElement}
            {hasAddon && !isAppend && addonElement}
            {isAppend && appendElement}
        </div>
    );
}