import { type  CycleOfMonths } from '@repo/services/date/month/month';
import type { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';
import type { TablesParams } from '@repo/services/spreadsheet/table/types';

import type Expense from '../../expense';

import type Bill from '../bill';

export type SpreadsheetProcessingParams = {
    data: Array<Bill>;
    sheet: Spreadsheet;
    summary?: boolean;
    startRow?: number;
    groupName: string;
    tableWidth?: number;
    groupsName?: Array<string>;
    startColumn?: number;
    detailTables?: Array<string>;
    summaryTitle?: string;
    allExpensesHaveBeenPaid: (data: Array<Expense>) => boolean;
    buildExpensesTablesParams: (data: Array<Expense>, tableWidth: number) => TablesParams;
}

export type ProcessingSpreadsheetTableParams = Pick<SpreadsheetProcessingParams, 'sheet' | 'allExpensesHaveBeenPaid'> & {
    table?: SpreadsheetTable;
    startRow: number;
    startColumn: number;
}

export type ProcessingSpreadsheetDetailTableParams =
    Pick<SpreadsheetProcessingParams, 'sheet' | 'buildExpensesTablesParams'> &
    Pick<ProcessingSpreadsheetTableParams, 'startRow'> &
{
    table: SpreadsheetTable;
    startRow: number;
    tableWidth: number;
}


export type ProcessingSpreadsheetSecondaryTablesParams =
    Pick<SpreadsheetProcessingParams, 'sheet' | 'data' | 'buildExpensesTablesParams' | 'allExpensesHaveBeenPaid'> &
    Pick<ProcessingSpreadsheetTableParams, 'startRow' | 'startColumn'> &
    Pick<ProcessingSpreadsheetDetailTableParams, 'tableWidth'> & {
    groupsName: Array<string>;
    detailTables: Array<string>;

}

export type BuildBodyDataParams<T> = {
    data: Array<T> | T;
    title: string;
    allHaveBeenPaid: (data: Array<T>) => boolean;
}

export type BodyData = CycleOfMonths & {
    paid: boolean;
    title: string;
    total: number;
}

type SpreadsheetTable = {
    data?: Array<{
        list: Array<Expense>;
        item?: Expense;
        title: string;
    }>;
    title?: string;
    footer?: boolean;
    header: Array<string>;
}