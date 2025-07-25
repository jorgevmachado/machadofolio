import type React from 'react';
import type { TColors } from '../../utils';

export type TIcon =
    | 'tv'
    | 'box'
    | 'tag'
    | 'key'
    | 'map'
    | 'egg'
    | 'eye'
    | 'bed'
    | 'user'
    | 'edit'
    | 'lamp'
    | 'star'
    | 'bolt'
    | 'book'
    | 'info'
    | 'code'
    | 'like'
    | 'exit'
    | 'flag'
    | 'link'
    | 'list'
    | 'lock'
    | 'sort'
    | 'stop'
    | 'home'
    | 'trash'
    | 'group'
    | 'brush'
    | 'chair'
    | 'check'
    | 'close'
    | 'react'
    | 'phone'
    | 'cloud'
    | 'hotel'
    | 'image'
    | 'inbox'
    | 'gavel'
    | 'eject'
    | 'pause'
    | 'print'
    | 'store'
    | 'reply'
    | 'train'
    | 'route'
    | 'share'
    | 'config'
    | 'church'
    | 'google'
    | 'camera'
    | 'anchor'
    | 'folder'
    | 'expand'
    | 'filter'
    | 'cookie'
    | 'laptop'
    | 'wallet'
    | 'upload'
    | 'school'
    | 'rocket'
    | 'shower'
    | 'tablet'
    | 'android'
    | 'forward'
    | 'comment'
    | 'gamepad'
    | 'palette'
    | 'receipt'
    | 'confirm'
    | 'warning'
    | 'expense'
    | 'user-tie'
    | 'category'
    | 'arrow-up'
    | 'facebook'
    | 'calendar'
    | 'document'
    | 'bookmark'
    | 'compress'
    | 'terminal'
    | 'download'
    | 'keyboard'
    | 'umbrella'
    | 'sign-in'
    | 'sign-out'
    | 'warehouse'
    | 'lightbulb'
    | 'lock-open'
    | 'handshake'
    | 'power-off'
    | 'reply-all'
    | 'newspaper'
    | 'star-half'
    | 'bluetooth'
    | 'dashboard'
    | 'hamburger'
    | 'eye-close'
    | 'arrow-down'
    | 'arrow-left'
    | 'headphones'
    | 'volume-off'
    | 'transgender'
    | 'folder-open'
    | 'credit-card'
    | 'fingerprint'
    | 'arrow-right'
    | 'battery-full'
    | 'star-filled'
    | 'chevron-up'
    | 'chevron-left'
    | 'chevron-down'
    | 'chevron-right'
    | 'arrow-up-outline'
    | 'charging-station'
    | 'arrow-down-outline'
    | 'fire-extinguisher';


export type TIconGroup =
    | 'ci'
    | 'fa'
    | 'fa6'
    | 'gi'
    | 'io'
    | 'io5'
    | 'md'
    | 'vsc';

export type TIconPosition = 'left' | 'right';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    icon: React.ReactNode | TIcon;
    size?: string | number;
    color?: TColors;
    group?: TIconGroup;
    withDefault?: boolean;
}

export type TGenericIconProps = IconProps & {
    noBorder?: boolean;
    position?: TIconPosition;
};