import React, { useContext } from 'react';

import { EInputContentChildren, useChildrenElements } from '../../utils';

import { type TGenericIconProps, Text } from '../../elements';

type TextProps = React.ComponentProps<typeof Text>;

type InputContextProps = {
    hasIcon: (position: 'left' | 'right', icon?: TGenericIconProps) => boolean;
    hasAddon: boolean;
    hasAppend: boolean;
    hasCounter: boolean;
    hasPrepend: boolean;
    hasCalendar: boolean;
    hasIconLeft: boolean;
    hasIconRight: boolean;
    addonElement?: React.ReactNode;
    appendElement?: React.ReactNode;
    prependElement?: React.ReactNode;
    hasIconElement: (position: 'left' | 'right', icon?: TGenericIconProps) => boolean;
    counterElement?: React.ReactNode;
    iconLeftElement?: React.ReactNode;
    calendarElement?: React.ReactNode;
    iconRightElement?: React.ReactNode;
}

const InputContext = React.createContext<InputContextProps>({
    hasIcon: () => false,
    hasAddon: false,
    hasAppend: false,
    hasCounter: false,
    hasPrepend: false,
    hasCalendar: false,
    hasIconLeft: false,
    hasIconRight: false,
    addonElement: undefined,
    appendElement: undefined,
    prependElement: undefined,
    hasIconElement: () => false,
    counterElement: undefined,
    iconLeftElement: undefined,
    calendarElement: undefined,
    iconRightElement: undefined,
});

type InputProviderProps = {
    value: React.ReactNode;
    addon?: TextProps;
    counter?: TextProps;
    children: React.ReactNode;
}

export function InputProvider({ value, addon, counter, children }: InputProviderProps) {
    const { getChildrenElement, childrenElements } = useChildrenElements(value);

    const hasPrepend = Boolean(childrenElements[EInputContentChildren.PREPEND]);
    const prependElement = getChildrenElement(EInputContentChildren.PREPEND);

    const hasCalendar = Boolean(childrenElements[EInputContentChildren.CALENDAR]);
    const calendarElement = getChildrenElement(EInputContentChildren.CALENDAR);

    const hasAppend = Boolean(childrenElements[EInputContentChildren.APPEND]);
    const appendElement = getChildrenElement(EInputContentChildren.APPEND);

    const hasIconLeft = Boolean(childrenElements[EInputContentChildren.ICON_LEFT]);
    const iconLeftElement = getChildrenElement(EInputContentChildren.ICON_LEFT);

    const hasIconRight = Boolean(childrenElements[EInputContentChildren.ICON_RIGHT]);
    const iconRightElement = getChildrenElement(EInputContentChildren.ICON_RIGHT);

    const counterElement =
        counter
            ? (<Text {...counter}/>)
            : getChildrenElement(EInputContentChildren.COUNTER);
    const hasCounter = Boolean(counterElement);

    const addonElement = addon
        ? (<Text {...addon}/>)
        : getChildrenElement(EInputContentChildren.ADDON);
    const hasAddon = Boolean(addonElement);

    const hasIcon = (position: 'left' | 'right', icon?: TGenericIconProps): boolean => {
        if(position === 'left') {
            return Boolean(icon && (!icon?.position || icon.position === 'left'));
        }
        return Boolean(icon && icon.position === 'right');
    }

    const hasIconElement = (position: 'left' | 'right', icon?: TGenericIconProps) => {
        if(position === 'left') {
            return hasIcon(position, icon) || hasIconLeft;
        }
        return hasIcon(position, icon) || hasIconRight;
    }

    const context: InputContextProps = {
        hasIcon,
        hasAddon,
        hasAppend,
        hasCounter,
        hasPrepend,
        hasCalendar,
        hasIconLeft,
        hasIconRight,
        addonElement,
        appendElement,
        prependElement,
        counterElement,
        iconLeftElement,
        calendarElement,
        iconRightElement,
        hasIconElement,
    };
    return (
        <InputContext.Provider value={context}>
            {children}
        </InputContext.Provider>
    );
}

export function useInput(){
    return useContext(InputContext);
}