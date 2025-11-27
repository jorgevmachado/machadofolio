import React, { useEffect, useState } from 'react';

import { Text, Spinner } from '../../elements';
import { joinClass } from '../../utils';
import { useBreakpoint } from '../../hooks';

import Header from './header';
import Body from './body';
import { getNewSort, resetSortedColumn, sortItems } from './sort';
import type { SortedColumn, TableProps, TSort } from './types';

import './Table.scss';

export default function Table({
                                  items,
                                  style,
                                  headers,
                                  actions,
                                  loading,
                                  onRowClick,
                                  sortedColumn = resetSortedColumn,
                                  formattedDate = true,
                                  onChangeOrder,
                                  onSortedColumn,
                                  getClassNameRow,
                                  notFoundMessage,
                                  ...props
                              }: TableProps) {
    const [sortedItems, setSortedItems] = useState<TableProps['items']>([...items]);
    const [currentHeaders, setCurrentHeaders] = useState<TableProps['headers']>(headers);
    const [currentSortedColumn, setCurrentSortedColumn] = useState<SortedColumn>(sortedColumn);

    const { isMobile } = useBreakpoint();

    const classNameList = joinClass([
        'ds-table',
        Boolean(onRowClick) && 'ds-table__action-row',
    ]);

    const handleSort = (header: TableProps['headers'][number]) => {
        const newSort = getNewSort(header, currentSortedColumn);
        if (currentSortedColumn.sort === header.value && currentSortedColumn.order === 'desc') {
            setSortedItems([...items]);
        }
        setCurrentSortedColumn(newSort);
        if(onChangeOrder) {
            onChangeOrder(newSort);
        }
        if(onSortedColumn) {
            onSortedColumn(newSort);
        }
    }

    const updateTable = (sort: boolean) => {
        if (currentSortedColumn.sort && !onChangeOrder) {
            const currentItems = sortItems(
                currentSortedColumn.order as TSort,
                currentSortedColumn.sort,
                items,
            );
            setSortedItems([...currentItems]);
            return;
        }
        if (!sort) {
            setSortedItems([...items]);
        }
    };

    useEffect(() => {
        setSortedItems([...items]);
    }, [items]);

    useEffect(() => {
        updateTable(false);
    }, [items]);

    useEffect(() => {
        updateTable(true);
    }, [currentSortedColumn.order, currentSortedColumn.sort]);

    useEffect(() => {
        setCurrentHeaders(headers);
        if(isMobile) {
            setCurrentHeaders((prev) => {
                return prev.map((item) => ({
                    ...item,
                    align: 'center',
                }))
            });
        }
    }, [isMobile]);

    useEffect(() => {
        setCurrentHeaders(headers);
    }, [headers]);

    return loading
        ? (<Spinner />)
        : (
            <div {...props} className={classNameList} data-testid="ds-table">
                {sortedItems.length === 0 ? (
                    <div className="ds-table__no-data-container" data-testid="ds-table-no-data">
                        <Text id="ds-table-not-found">{notFoundMessage ? notFoundMessage : 'No data found!!'}</Text>
                    </div>
                ) : (
                    <table cellSpacing="0" cellPadding="0" style={style} data-testid="ds-table-data">
                        <Header
                            headers={currentHeaders}
                            actions={actions}
                            handleSort={handleSort}
                            sortedColumn={currentSortedColumn}
                        />
                        <Body
                            headers={currentHeaders}
                            actions={actions}
                            onRowClick={onRowClick}
                            sortedItems={sortedItems}
                            formattedDate={formattedDate}
                            getClassNameRow={getClassNameRow}
                        />
                    </table>
                )}
            </div>
        );
};