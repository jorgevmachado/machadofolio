import type { TableParams, TablesParams } from '@repo/services/spreadsheet/table/types';
import type { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';

import type Expense from '../../expense';

import type Bill from '../bill';


export type BodyData = Omit<Expense,
    'id' |
    'year' |
    'type' |
    'bill' |
    'name' |
    'parent' |
    'children' |
    'supplier' |
    'name_code' |
    'total_paid' |
    'created_at' |
    'updated_at' |
    'deleted_at' |
    'is_aggregate' |
    'aggregate_name' |
    'instalment_number'> & Pick<Bill, 'type'> & {
    title: string;
}


export type SpreadsheetProcessingParams = {
    sheet: Spreadsheet;
    bills?: Array<Bill>;
    headers?: Array<string>;
    startRow?: number;
    tableWidth?: number;
    groupsName?: Array<string>;
    startColumn?: number;
    totalExpenseByMonth: (month: string, expenses: Array<Expense>) => number;
    allExpensesHaveBeenPaid: (expenses: Array<Expense>) => boolean;
    buildExpensesTablesParams: (expenses: Array<Expense>, tableWidth: number) => TablesParams;
}

export type ProcessingSpreadsheetTableParams = Pick<SpreadsheetProcessingParams, 'sheet' | 'allExpensesHaveBeenPaid' | 'totalExpenseByMonth'> & {
    bills: Array<Bill>;
    headers: Array<string>;
    startRow: number;
    groupsName: Array<string>;
    startColumn: number;
}

export type ProcessingSpreadsheetBasicExpenseTableParams = Omit<ProcessingSpreadsheetTableParams, 'startColumn' | 'headers' | 'groupsName' | 'allExpensesHaveBeenPaid' | 'totalExpenseByMonth'> & Pick<SpreadsheetProcessingParams, 'buildExpensesTablesParams'> & {
    tableWidth: number;
}

export type ProcessingSpreadSheetCreditCardExpenseTableParams = ProcessingSpreadsheetTableParams & Pick<ProcessingSpreadsheetBasicExpenseTableParams, 'tableWidth' | 'buildExpensesTablesParams'>;

export type GroupTablesParams = {
    title: string;
    tablesParams: TablesParams;
}

export type GroupTables = {
    tableParams: TableParams;
    groupTablesParams?: Array<GroupTablesParams>;
}

export type BuildBodyDataParams = Pick<SpreadsheetProcessingParams, 'totalExpenseByMonth' | 'allExpensesHaveBeenPaid'> & {
    title: string;
    expense?: Expense;
    expenses?: Array<Expense>;
    groupsName?: Array<string>;
}