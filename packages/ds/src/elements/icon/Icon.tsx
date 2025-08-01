import React from 'react';

import joinClass from '../../utils/join-class';

import type { IconProps, TIcon } from './types';
import { getIcon } from './service';

import './Icon.scss';

export default function Icon({
                                 icon,
                                 size,
                                 color,
                                 group,
                                 className,
                                 withDefault = true,
                                 ...props
                             }: IconProps) {
    const classNameList = joinClass([
        'ds-icon',
        color && `ds-color-${color}`,
        className,
    ]);

    const ariaLabel = typeof icon === 'string' ? icon : undefined;

    const currentData =
        typeof icon === 'string'
            ? getIcon({ name: icon as TIcon, size, color, group, withDefault })
            : {
                icon,
                group: group,
            };

    return (
        <span {...props} data-testid="ds-icon" className={classNameList} aria-label={ariaLabel} data-group={currentData.group}>
      {currentData.icon}
    </span>
    );
};
