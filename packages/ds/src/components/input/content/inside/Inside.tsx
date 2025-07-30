import React from 'react';

import { joinClass } from '../../../../utils';

import { Icon, type TGenericIconProps } from '../../../../elements';

import { useInput } from '../../InputContext';

import './Inside.scss';

type InsideProps = {
    icon?: TGenericIconProps;
    show?: boolean;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
    position: 'left' | 'right';
    isPassword?: boolean;

}

export default function Inside({ icon, show = true, onClick, position, isPassword }: InsideProps) {
    const {
        hasIcon,
        hasCounter,
        counterElement,
        iconLeftElement: leftElement,
        iconRightElement: rightElement,
    } = useInput();

    const renderIcon = (icon: TGenericIconProps) => {
        const classNameList = isPassword ? 'ds-inside__icon--password' : '';
        return (
            <Icon {...icon} className={classNameList} onClick={onClick}/>
        )
    }

    const iconLeftElement = icon && hasIcon('left', icon)
            ? renderIcon(icon)
            : leftElement;
    const isIconLeft = position === 'left' && Boolean(iconLeftElement);

    const iconRightElement = icon && hasIcon('right', icon)
            ? renderIcon(icon)
            : rightElement;
    const isIconRight = position === 'right' && Boolean(iconRightElement);

    const isCounter = hasCounter && position === 'right';

    const hasChildren = isIconLeft || isIconRight || isCounter;

    if(!hasChildren || !show) {
        return null;
    }

    const classNameList = joinClass([
        'ds-inside',
        isIconLeft && 'ds-inside__icon ds-inside__icon--left',
        isIconRight && 'ds-inside__icon ds-inside__icon--right',
        (isCounter && !isIconRight) && 'ds-inside__counter',
    ]);

    return (
        <div className={classNameList} data-testid="ds-inside">
            {isIconLeft && iconLeftElement}
            {isIconRight && iconRightElement}
            {isCounter && !isIconRight && counterElement}
        </div>
    )
}