import type { LineChartDataItem, LineChartProps } from '../types';

export type CustomDomainItem = {
    top: string | number;
    top2: string | number;
    left: string | number;
    right: string | number;
    bottom: string | number;
    bottom2: string | number;
    animation: boolean;
    refAreaLeft?: string | number;
    refAreaRight?: string | number;
};

export type GetAxisYDomainParams = {
    to?: string | number;
    ref: keyof LineChartDataItem;
    data: Array<LineChartDataItem>;
    from?: string | number;
    offset: number;
}

export type UpdateDomainItemParams = {
    prev: CustomDomainItem;
    data?: LineChartProps['data'];
    labels?: LineChartProps['labels'];
}