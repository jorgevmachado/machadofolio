import React from 'react';

import { generateUUID } from '@repo/services';

import { Alert as AlertComponent } from '@repo/ds';

type AlertProps = React.ComponentProps<typeof AlertComponent>;

export type AlertDataProps =  {
    id?: string;
    type: AlertProps['type'];
    icon?: AlertProps['icon'];
    delay?: number;
    message: React.JSX.Element | string;
}

export default class Alert {
    public visible = true;
    public readonly id = generateUUID();
    public readonly icon: AlertDataProps['icon'] = undefined;
    public readonly type!: AlertDataProps['type'];
    public readonly delay: AlertDataProps['delay'] = 5000;
    public readonly message!: AlertDataProps['message'];

    constructor({ id, type, icon, delay, message }: AlertDataProps) {
        this.type = type;
        this.message = message;
        if(id) {
            this.id = id;
        }
        if (delay) {
            this.delay = delay;
        }
        if (icon) {
            this.icon = icon;
        }
    }
}