import type { CellParams } from '../worksheet';

import type { TableParams, TablesParams } from './types';

export const DEFAULT_TABLE_PARAMS: TableParams = {
    body: {
        list: [],
        styles: {
            font: { size: 12 },
            alignment: {
                horizontal: 'center',
                vertical: undefined,
                wrapText: true,
            },
            borderStyle: 'thin',
        }
    },
    headers: {
        list: [],
        styles: {
            font: {
                bold: true
            },
            alignment: {
                horizontal: 'center',
                vertical: undefined,
                wrapText: false,
            },
            borderStyle: 'thin',
        }
    },
    startRow: 0,
    tableWidth: 0,
    startColumn: 2
};

export const DEFAULT_TABLES_PARAMS: TablesParams = {
    tables: [],
    headers: [],
    bodyStyle: {
        alignment: {
            horizontal: 'center',
            vertical: undefined,
            wrapText: false,
        },
        borderStyle: 'thin',
    },
    titleStyle: {
        font: { bold: true },
        alignment: { wrapText: false },
        borderStyle: 'medium',
        fillColor: 'FFFFFF',
    },
    headerStyle: {
        font: {
            bold: true
        },
        alignment: {
            horizontal: 'center',
            vertical: undefined,
            wrapText: false,
        },
        borderStyle: 'thin',
    },
    tableDataRows: 0,
};

export const DEFAULT_TITLE_STYLES: CellParams['styles'] = {
    font: { bold: true },
    alignment: { wrapText: false },
    borderStyle: 'medium',
    fillColor: 'FFFFFF',
};