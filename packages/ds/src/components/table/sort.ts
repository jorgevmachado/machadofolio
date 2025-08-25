import type { SortedColumn, TableProps, TSort } from './types';

export const resetSortedColumn: SortedColumn = {
    order: '',
    sort: '',
};

export function getNewSort(
    header: TableProps['headers'][number],
    sortedColumn: SortedColumn,
): SortedColumn {
    if (sortedColumn.sort === header.value) {
        return sortedColumn.order !== 'desc'
            ? { ...sortedColumn, order: 'desc' }
            : resetSortedColumn;
    }
    return { order: 'asc', sort: header.value };
}

type SortItem = {
    [key: string]: string | number;
};

export function sortItems(order: TSort, key: string, items: Array<unknown>) {
    const itemsCopy = [...items] as Array<SortItem>;

    itemsCopy.sort((a: SortItem, b: SortItem) => {
        const valueA = getNestedValue(a, key);
        const valueB = getNestedValue(b, key);

        if (valueA === undefined || valueB === undefined) return 0;

        if (order === 'asc') {
            return valueA < valueB ? -1 : 1;
        }

        if (order === 'desc') {
            return valueA > valueB ? -1 : 1;
        }

        return 0;
    });

    return itemsCopy;
}

function getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}