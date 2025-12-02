import { type Spreadsheet, type TablesParams, type WorkSheet } from '@repo/services';

import type { Expense } from '../../../expense';
import type Bill from '../../bill';

export type SpreadsheetProcessingParams = {
    year: number;
    data: Array<Bill>;
    sheet: Spreadsheet;
    summary?: boolean;
    startRow?: number;
    groupName: string;
    tableWidth?: number;
    groupsName?: Array<string>;
    tableHeader?: Array<string>;
    startColumn?: number;
    detailTables?: Array<string>;
    summaryTitle?: string;
    detailTablesHeader?: Array<string>;
    summaryTableHeader?: Array<string>;
    allExpensesHaveBeenPaid: (data: Array<Expense>) => boolean;
    buildExpensesTablesParams: (data: Array<Expense>, tableWidth: number, headers: Array<string>) => TablesParams;
}

export type BodyData = Record<string, string | number | boolean>;

type BuildBodyDataExtras = Record<string, string | number | boolean | undefined | object | unknown[]>;

type BuildBodyDataCore<T> = {
    data: Array<T> | T;
    arrFunction: (data: Array<T>) => boolean;
};

export type GetWorkSheetTitle = {
    year: number;
    nextRow: number;
    groupName: string;
}

export type GetWorkSheetTitleParams = {
    row: number;
    merge?: number;
    column: number;
    topSpace?: number;
    workSheet: WorkSheet
    bottomSpace?: number;
}

export type BuildBodyDataParams<T> = BuildBodyDataExtras & BuildBodyDataCore<T>;

export type SpreadsheetTableData<T> = {
    list: Array<T>;
    item?: T;
} & BuildBodyDataExtras;

type SpreadsheetTable<T> = {
    data?: Array<SpreadsheetTableData<T>>;
    title?: string;
    footer?: boolean;
    header: Array<string>;
}

export type ProcessingSpreadsheetTableParams<T> = Pick<SpreadsheetProcessingParams, 'sheet'> & {
    table?: SpreadsheetTable<T>;
    startRow: number;
    startColumn: number;
    buildFooterData?: (data: Array<BodyData>) => BodyData;
    buildBodyDataMap: (data: SpreadsheetTableData<T>) => BuildBodyDataParams<T>;
}

export type ProcessingSpreadsheetSecondaryTablesParams =
    Pick<SpreadsheetProcessingParams, 'sheet' | 'data' | 'buildExpensesTablesParams' | 'allExpensesHaveBeenPaid'> &
    Pick<ProcessingSpreadsheetTableParams<unknown>, 'startRow' | 'startColumn'> &
    Pick<ProcessingSpreadsheetDetailTableParams, 'tableWidth' | 'detailTablesHeader'> & {
    groupsName: Array<string>;
    tableHeader: Array<string>;
    detailTables: Array<string>;
}

export type ProcessingSpreadsheetDetailTableParams =
    Pick<SpreadsheetProcessingParams, 'sheet' | 'buildExpensesTablesParams'> &
    Pick<ProcessingSpreadsheetTableParams<unknown>, 'startRow'> &
    {
        table: SpreadsheetTable<Expense>;
        startRow: number;
        tableWidth: number;
        detailTablesHeader: Array<string>;
    }