import React, { type ComponentProps, forwardRef, useEffect, useState } from 'react';

import { joinClass, useChildrenElements } from '../../../utils';

import { Icon, type TIconPosition, Text } from '../../../elements';

import './Content.scss';

enum EInputContentChildren {
    ADDON = 'addon',
    APPEND = 'append',
    COUNTER = 'counter',
    PREPEND = 'prepend',
    ICON_LEFT = 'icon-left',
    ICON_RIGHT = 'icon-right',
}

export type IconProps = ComponentProps<typeof Icon> & {
    position?: TIconPosition;
};

export type TextProps = Omit<ComponentProps<typeof Text>, 'children'> & {
    value: React.ReactNode | string;
};

interface ContentProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    type: string;
    icon?: IconProps;
    rows?: number;
    addon?: TextProps;
    fluid?: boolean;
    counter?: TextProps;
    children?: React.ReactNode;
    isInvalid?: boolean;
}

const Content = forwardRef<HTMLInputElement | HTMLTextAreaElement, ContentProps> (
    (
        {
            id,
            icon,
            rows,
            type,
            addon,
            fluid = false,
            counter,
            disabled,
            children,
            className,
            isInvalid = false,
            ...props
        },
        ref,
    ) => {
        const [currentIcon, setCurrentIcon] = useState<IconProps | undefined>(icon);
        const [typeInput, setTypeInput] = useState<string | undefined>(type);

        const { getChildrenElement, childrenElements } = useChildrenElements(children);


        const isPassword = type === 'password';
        const toggleShowPassword = (e: React.MouseEvent<HTMLSpanElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setTypeInput((prev) => (prev === 'password' ? 'text' : 'password'));
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
        };

        const renderIcon = () => {
            const classNameList = isPassword ? 'ds-input-content__icon--password' : '';
            return (
                <Icon
                    icon={currentIcon?.icon}
                    color={currentIcon?.color}
                    onClick={isPassword ? toggleShowPassword : undefined}
                    className={classNameList}
                />
            );
        };

        const isPrepend = Boolean(childrenElements[EInputContentChildren.PREPEND]);
        const prependElement = getChildrenElement(EInputContentChildren.PREPEND);

        const iconLeftElement = currentIcon && (!currentIcon.position || currentIcon.position === 'left')
            ? renderIcon()
            : getChildrenElement(EInputContentChildren.ICON_LEFT);
        const hasIconLeft = Boolean(iconLeftElement);

        const iconRightElement =
            currentIcon && currentIcon.position === 'right'
                ? renderIcon()
                : getChildrenElement(EInputContentChildren.ICON_RIGHT);
        const hasIconRight = Boolean(iconRightElement);

        const counterElement =
            counter
            ? (<Text {...counter}>{counter.value}</Text>)
            : getChildrenElement(EInputContentChildren.COUNTER);
        const hasCounter = Boolean(counterElement);

        const isTextArea = typeInput === 'textarea';

        const isAppend = Boolean(childrenElements[EInputContentChildren.APPEND]);
        const appendElement = getChildrenElement(EInputContentChildren.APPEND);

        const addonElement = addon
            ? (<Text {...addon}>{addon.value}</Text>)
            : getChildrenElement(EInputContentChildren.ADDON);
        const hasAddon = Boolean(addonElement);

        const inputElementClassNameList = joinClass([
            'ds-input-content__field',
            fluid && 'ds-input-content__field--fluid',
            isPrepend && 'ds-input-content__field--prepend',
            hasIconLeft && 'ds-input-content__field--icon-left',
            hasIconRight && 'ds-input-content__field--icon-right',
            isAppend && 'ds-input-content__field--append',
            hasAddon && !isAppend && 'ds-input-content__field--addon',
            hasCounter && !hasIconRight && 'ds-input-content__field--counter',
            isTextArea && 'ds-input-content__field--textarea',
            disabled && 'ds-input-content__field--disabled',
            isInvalid && 'ds-input-content__field--error',
            className,
        ]);

        const inputElementProps = {
            id,
            type: typeInput,
            rows: isTextArea ? rows : undefined,
            disabled,
            className: inputElementClassNameList,
            ...props,
        }

        useEffect(() => {
            if(!currentIcon && typeInput === 'password') {
                setCurrentIcon({
                    icon: 'eye',
                    color: 'neutral-80',
                    position: 'right',
                });
            }
        }, [currentIcon, icon, typeInput]);

        return (
            <div className="ds-input-content" data-testid="ds-input-content">
                {isPrepend && (
                    <div className="ds-input-content__prepend">{prependElement}</div>
                )}
                <div className="ds-input-content__wrapper">
                    {hasIconLeft && (
                        <div className="ds-input-content__wrapper--icon ds-input-content__wrapper--icon-left">
                            {iconLeftElement}
                        </div>
                    )}
                    {isTextArea
                        ? (
                            <textarea ref={ref as React.Ref<HTMLTextAreaElement>} {...inputElementProps}/>
                        )
                        : (
                            <input ref={ref as React.Ref<HTMLInputElement>} {...inputElementProps}/>
                        )
                    }

                    {hasIconRight && (
                        <div className="ds-input-content__wrapper--icon ds-input-content__wrapper--icon-right">
                            {iconRightElement}
                        </div>
                    )}
                    {hasCounter && !hasIconRight && (
                        <div className="ds-input-content__wrapper--counter">
                            {counterElement}
                        </div>
                    )}
                </div>

                {hasAddon && !isAppend && (
                    <div className="ds-input-content__addon">
                        {addonElement}
                    </div>
                )}
                {isAppend && (
                    <div className="ds-input-content__append">{appendElement}</div>
                )}
            </div>
        );
    })
Content.displayName = 'Content';

export default Content;