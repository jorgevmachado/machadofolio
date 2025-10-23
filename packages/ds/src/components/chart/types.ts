export type ColorProps = {
    type: string;
    name: string;
    color: string;
};

export type TChartColor = 'default' |'bank' | 'highlight' | 'harmony' | 'organic' | 'emphasis';

export type DataChartItem = {
    type: TChartColor;
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
    payload: DataChartItem;
    strokeWidth?: any;
}

export type ChartTooltipProps = {
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