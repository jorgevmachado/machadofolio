import React, { useEffect, useState } from 'react';

import { joinClass } from '../../../utils';
import { Icon } from '../../../elements';

import type { SortedColumn, TableProps } from '../types';

import './Header.scss';

type HeaderProps = Pick<
    TableProps,
    | 'headers'
    | 'actions'
> & {
    handleSort: (header: TableProps['headers'][number]) => void;
    sortedColumn: SortedColumn;
};

export default function Header({ headers, actions, handleSort, sortedColumn }: HeaderProps) {
    const [data, setData] = useState<TableProps['headers']>([]);


    const classNameCellList = (sortable: boolean) => joinClass([
        'ds-table-header__cell',
        sortable && 'ds-table-header__cell--sortable',
    ]);

    const sortIcon = (value: string) => {
        if (value === sortedColumn.sort) {
            return sortedColumn.order === 'asc' ? 'chevron-down' : 'chevron-up';
        }
        return 'sort';
    }

    const classNameSortList = ( value: string) =>  joinClass([
        sortedColumn && sortedColumn.sort === value
            ? 'ds-table-header__cell--content-icon ds-table-header__cell--content-icon__active'
            : 'ds-table-header__cell--content-icon',
    ]);

    useEffect(() => {
        setData(headers);
    }, [headers]);

    return (
        <thead className="ds-table-header" data-testid="ds-table-header">
        <tr>
            {data.map((item, index) => (
                <th
                    key={`table-header-column-${index}`}
                    role="columnheader"
                    scope="col"
                    align={item.align ?? 'left'}
                    style={item.style}
                    aria-label={item.text}
                    onClick={() => item.sortable && handleSort(item)}
                    className={classNameCellList(Boolean(item?.sortable))}
                    data-testid={`ds-table-header-${index}`}
                >
                    <div
                        style={{
                            flexWrap: 'wrap',
                            justifyContent: item.align ?? 'left',
                        }}
                        className="ds-table-header__cell--content">
                        <span>{item.text}</span>
                        {item.sortable && (
                            <Icon
                                icon={sortIcon(item.value)}
                                onClick={() => handleSort(item)}
                                className={classNameSortList(item.value)}
                                data-testid={`ds-table-header-icon-${index}`}
                            />
                        )}
                    </div>
                </th>
            ))}
            {actions && (
                <th>
                    <div
                        style={{ justifyContent: actions?.align ?? 'center' }}
                        className="ds-table-header__cell--content"
                    >
                        <span>{ actions?.text ?? 'Actions'}</span>
                    </div>
                </th>
            )}
        </tr>
        </thead>
    )
}