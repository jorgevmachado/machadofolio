import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Button } from '@repo/ds';

import { AlertProvider, useAlert } from "./AlertContext";
import { AlertDataProps } from './Alert';

const meta: Meta = {
    title: 'Hooks/Alert',
    component: AlertProvider,
    decorators: [
        (Story) => (
            <div style={{ height: '100vh' }}>
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof AlertProvider>;
export default meta;

type TCustomAlertPropsItem = Omit<AlertDataProps, 'message'> & {
    message?: string;
    buttonLabel?: string;
}

type CustomAlertProps = {
    items: Array<TCustomAlertPropsItem>;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ items }) => {
    const { addAlert, alerts } = useAlert();

    const currentMessage = (message: string) => {
        return `${message} generated in ${new Date().toLocaleTimeString()}`
    }

    return (
        <div>
            <h3>Add Alert</h3>
            <div style={{ display: 'flex', width: '350px', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {items.map((item, index) => (
                    <Button
                        key={`${item.type}-${index}`}
                        context={item.type === 'warning' ? 'attention' : item.type}
                        onClick={() =>
                            addAlert({
                                type: item.type,
                                icon: item.icon,
                                message: currentMessage(item.message || `This is an "${item.type}" type alert`),
                            })
                        }
                    >
                        {item?.buttonLabel || `Add ${item.type}`}
                    </Button>
                ))}
            </div>
            <div style={{ marginTop: 24 }}>
                <strong>Active alerts:</strong>
                <ul>
                    {alerts.map((a) => (
                        <li key={a.id} style={{ color: "#999" }}>
                            {a.type}: {a.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const listCustomAlert: Array<TCustomAlertPropsItem> = [
    { type: 'info' },
    { type: 'error' },
    { type: 'warning' },
    { type: 'success' },
    { type: 'info', icon: 'lamp', buttonLabel: 'Add Custom Icon Info Lamp', message: 'this is a custom icon info lamp' },
    { type: 'error', icon: 'rocket', buttonLabel: 'Add Custom Icon Error rocket', message: 'this is a custom icon error rocket' },
    { type: 'warning', icon: 'warehouse', buttonLabel: 'Add Custom Icon Warning warehouse', message: 'this is a custom icon warning warehouse' },
    { type: 'success', icon: 'expense', buttonLabel: 'Add Custom Icon Success expense', message: 'this is a custom icon success expense' },
]

export const Default: StoryObj = {
    render: () => (
        <AlertProvider>
            <CustomAlert items={listCustomAlert}/>
        </AlertProvider>
    ),
}