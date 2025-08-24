import React, { useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Button } from '@repo/ds';
import { Spinner } from '@repo/ds';

import { LoadingProvider, useLoading } from './LoadingContext';

type SpinnerProps = React.ComponentProps<typeof Spinner>;

const meta: Meta = {
    title: 'Hooks/Loading',
    component: LoadingProvider,
    decorators: [
        (Story) => (
            <div style={{ height: '100vh' }}>
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof LoadingProvider>;
export default meta;

type CustomLoadingProps = {
    items: Array<SpinnerProps>;
}

const CustomLoading: React.FC<CustomLoadingProps> = ({ items }) => {
    const { show, hide, isLoading } = useLoading();

    useEffect(() => {
        if(isLoading) {
            setTimeout(() => {
                hide();
            }, 3000);
        }
    }, [isLoading]);

    return (
        <div>
            <h3>Add Loading</h3>
            <div style={{ display: 'flex', width: '350px', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {items.map((item, index) => (
                    <Button key={index} context="primary" loading={isLoading} onClick={() => show(item)}>
                        Add Loading {item.type}
                    </Button>
                ))}
            </div>
        </div>
    )
}

const listCustomLoading: Array<SpinnerProps> = [
    { type: 'circle', size: 60},
    { type: 'dots', size: 60 },
    { type: 'bar', size: 4 },
];

export const Default: StoryObj = {
    render: () => (
        <LoadingProvider>
            <CustomLoading items={listCustomLoading}/>
        </LoadingProvider>
    ),
}