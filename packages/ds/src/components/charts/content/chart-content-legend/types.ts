import type { DefaultLegendContentProps } from 'recharts';

import type { LegendProps } from '../../types';

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