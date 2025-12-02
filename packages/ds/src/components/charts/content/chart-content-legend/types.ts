import type { LegendProps } from '../../types';

import type { DefaultLegendContentProps } from 'recharts';

type LegendPayloadProps = {
    [key: string]: string | number | undefined;
    value: string | undefined;
}

export type LegendContentProps = Omit<DefaultLegendContentProps, 'ref' | 'payload'> & {
    payload: ReadonlyArray<LegendPayloadProps>;
}

export type ChartContentLegendProps = {
    params: LegendContentProps;
    legend: LegendProps
}