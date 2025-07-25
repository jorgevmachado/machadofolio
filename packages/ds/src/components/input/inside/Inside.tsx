import React, { type ComponentProps, useEffect, useState } from 'react';

import { EInputContentChildren, joinClass, useChildrenElements } from '../../../utils';

import { Icon, type TGenericIconProps, Text } from '../../../elements';

import './Inside.scss';

type InsideProps = {
    icon?: TGenericIconProps;
    counter?: ComponentProps<typeof Text>;
    children: React.ReactNode;
    position: 'left' | 'right';
    isPassword?: boolean;
    toggleShowPassword?: () => void;
}

export default function Inside({
    icon,
    counter,
    children,
    position,
    isPassword,
    toggleShowPassword
}: InsideProps) {
    const [currentIcon, setCurrentIcon] = useState<TGenericIconProps | undefined>(icon);

    const { getChildrenElement } = useChildrenElements(children);

    const handleOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIcon((prev) => {
            if(prev?.icon === 'eye') {
                return {
                    ...prev,
                    icon: 'eye-close',
                }
            }
            return {
                ...prev,
                icon: 'eye'
            }
        });
        if(toggleShowPassword) {
            toggleShowPassword();
        }
    }

    const renderIcon = () => {
        const classNameList = isPassword ? 'ds-inside__icon--password' : '';
        return (
            <Icon
                icon={currentIcon?.icon}
                color={currentIcon?.color}
                onClick={isPassword ? handleOnClick : undefined}
                className={classNameList}
            />
        );
    };

    const iconLeftElement = currentIcon && (!currentIcon.position || currentIcon.position === 'left')
        ? renderIcon()
        : getChildrenElement(EInputContentChildren.ICON_LEFT);
    const hasIconLeft = position === 'left' && Boolean(iconLeftElement);

    const iconRightElement =
        currentIcon && currentIcon.position === 'right'
            ? renderIcon()
            : getChildrenElement(EInputContentChildren.ICON_RIGHT);
    const hasIconRight = position === 'right' && Boolean(iconRightElement);

    const counterElement =
        counter
            ? (<Text {...counter}>{counter.children}</Text>)
            : getChildrenElement(EInputContentChildren.COUNTER);
    const hasCounter = position === 'right' && Boolean(counterElement);

    const hasChildren = hasIconLeft || hasIconRight || hasCounter;

    useEffect(() => {
        if(!currentIcon && isPassword) {
            setCurrentIcon({
                icon: 'eye',
                color: 'neutral-80',
                position: 'right',
            });
        }
    }, [currentIcon, isPassword]);

    if(!hasChildren) {
        return null;
    }

    const classNameList = joinClass([
        'ds-inside',
        isPassword && 'ds-inside__password',
        hasIconLeft && 'ds-inside__icon ds-inside__icon--left',
        hasIconRight && 'ds-inside__icon ds-inside__icon--right',
        (hasCounter && !hasIconRight) && 'ds-inside__counter',
    ])

    return (
        <div className={classNameList} data-testid="ds-inside">
            {hasIconLeft && iconLeftElement}
            {hasIconRight && iconRightElement}
            {hasCounter && !hasIconRight && counterElement}
        </div>
    )
}