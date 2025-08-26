import React from 'react';

import { type TColors } from '../../utils';

import { ETypeTableHeader } from './enum';

import Button from '../button'

type ButtonProps = React.ComponentProps<typeof Button>;

type TAlign = 'left' | 'right' | 'center';

export type TableProps = {
    items: Array<unknown>;
    style?: React.CSSProperties;
    headers: Array<TableHeaderItem>;
    actions?: TableActions;
    loading?: boolean;
    onRowClick?(item: unknown): void;
    sortedColumn?: SortedColumn;
    formattedDate?: boolean;
    onChangeOrder?(sortedColumn: SortedColumn): void;
    onSortedColumn?(sortedColumn: SortedColumn): void;
    getClassNameRow?(item: unknown): string;
    notFoundMessage?: string;
}

type TableHeaderItem = {
    text: string;
    type?: ETypeTableHeader;
    value: string;
    align?: TAlign;
    style?: React.CSSProperties;
    sortable?: boolean;
    conditionColor?: ConditionColor;
};

export type ConditionColor = {
    value: string;
    trueColor: TColors;
    falseColor: TColors;
};

export type TableActions = {
    text?: string;
    edit?: TableActionsItem;
    align?: TAlign;
    delete?: TableActionsItem;
}

export type TableActionsItem = Omit<ButtonProps, 'onClick'> & {
    onClick(item: unknown): void;
}

export type SortedColumn = {
    sort: string;
    order: TSort;
}

export type TSort = 'asc' | 'desc' | '';