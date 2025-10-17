export type DataItemProps = {
    type: string;
    name: string;
    fill?: string;
    value: number;
    count?: number;
    color: string;
    percentageTotal?: number;
};


export type PayloadItemProps = {
    hide: boolean;
    name: string;
    fill?: any;
    type?: any;
    unit?: any;
    value: number;
    color?: string;
    stroke?: any;
    dataKey: string;
    nameKey?: any;
    payload: DataItemProps;
    strokeWidth?: any;
}

export type TooltipProps = {
    active?: boolean;
    payload?: Array<PayloadItemProps>;
    countText?: string;
    valueText?: string;
    percentageText?: string;
};

export type AxisProps = {
    x: {
        type?: 'number';
        width?: number;
        dataKey?: 'name';
        tickFormatter?: ((value: number) => string);
    };
    y: {
        type?: 'category';
        width?: number;
        dataKey?: 'name';
        tickFormatter?: ((value: number) => string);
    };
}