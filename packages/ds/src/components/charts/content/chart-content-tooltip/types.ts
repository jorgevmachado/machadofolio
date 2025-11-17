import { TooltipContentProps as RechartsTooltipContentProps } from 'recharts';
type TValue = number | string | Array<number | string>;
type TName = number | string;

export type TooltipContentProps =  RechartsTooltipContentProps<TValue, TName>;
