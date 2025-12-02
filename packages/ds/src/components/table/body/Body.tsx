import React from 'react';

import { currencyFormatter } from '@repo/services';

import { ETypeTableHeader } from '../enum';
import type { TableProps } from '../types';

import Actions from './actions';

type BodyProps = Pick<
    TableProps,
    | 'headers'
    | 'actions'
    | 'onRowClick'
    | 'formattedDate'
    | 'getClassNameRow'
> & {
    sortedItems: Array<unknown>;
}

export default function Body({
                                 headers,
                                 actions,
                                 onRowClick,
                                 sortedItems,
                                 formattedDate,
                                 getClassNameRow,
                             }: BodyProps) {

    const handleRowClick = (
        event: React.MouseEvent<HTMLTableRowElement>,
        item: unknown,
    ) => {
        event.preventDefault();

        if(onRowClick) {
            onRowClick(item);
        }
    }

    const conditionColor = (header: TableProps['headers'][number], item: unknown) => {
        if(!header.conditionColor) {
            return `ds-color-neutral-90`;
        }
        const condition = header.conditionColor.value;
        const conditionValue = (item as Record<string, unknown>)[condition];
        const trueColor = header.conditionColor.trueColor;
        const falseColor = header.conditionColor.falseColor;
        return `ds-color-${conditionValue ? trueColor : falseColor}`;
    }

    const renderData = (
        item: unknown,
        header: TableProps['headers'][number],
    ) : React.ReactNode => {
        const value = renderValue(item, header.value);

        if (React.isValidElement(value)) {
            return value;
        }

        if (typeof value === 'string' || typeof value === 'number') {
            if (header.type === ETypeTableHeader.DATE && formattedDate) {
                return new Date(value).toLocaleDateString();
            }

            if (header.type === ETypeTableHeader.MONEY) {
                const valueNumber =
                    typeof value === 'string' ? parseFloat(value) : value;
                return currencyFormatter(valueNumber);
            }

            return value;
        }
        return null;
    }

    const renderValue = (item: unknown, value: string) => {
        return value
            .split('.')
            .reduce((acc, key) => acc && (acc as Record<string, unknown>)[key], item);
    }

    return (
        <tbody data-testid="ds-table-body">
        {sortedItems.map((item: unknown, index: number) => (
            <tr
                key={`table-row-${index}`}
                onClick={(event) => handleRowClick(event, item)}
                className={getClassNameRow && getClassNameRow(item)}
                data-testid={`ds-table-body-row-${index}`}
            >
                {headers.map((header, index) => (
                    <td
                        key={`${header.value}-${index}`}
                        align={header.align ?? 'left'}
                        className={conditionColor(header, item)}
                        data-testid={`ds-table-body-column-${index}`}
                    >
                        {renderData(item, header)}
                    </td>
                ))}
                <Actions item={item} actions={actions}/>
            </tr>
        ))}
        </tbody>
    )
}