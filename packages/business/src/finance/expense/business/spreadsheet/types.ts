import { CycleOfMonths, EMonth, WorkSheet } from '@repo/services';

import type { Bill } from '../../../bill';
import type * as ExcelJS from 'exceljs';

export type DataAccumulator = Array<Record<string, string | number | boolean | object>>;

export type AccumulateGroupTables = {
    acc: DataAccumulator;
    lastRow: number;
};

export type AccumulateGroupTablesParams = {
    acc: DataAccumulator;
    bill: Bill;
    startRow: number;
    workSheet: WorkSheet;
};

export type BuildDetailDataParams = {
    row: number;
    cell: ExcelJS.Cell;
    bill: Bill;
    column: number;
    workSheet: WorkSheet;
}

export type BuildDetailData = CycleOfMonths & {
    bill: Bill;
    supplier: string;
}

export type BuildGroupTableParams = {
    row: number;
    bill: Bill;
    workSheet: WorkSheet;
}

export type BuildGroupTable = {
    data: Array<Record<string, string | number | boolean | object | Bill>>
    nextRow: number;
    hasNext: boolean;
}

export type GenerateDetailsTableParams = {
    bills: Array<Bill>;
    startRow: number;
    workSheet: WorkSheet;
};

export type GenerateDetailsTable = {
    data: Array<Record<string, string | number | boolean | object>>;
    nextRow: number;
};

export type BuildCreditCardBodyDataParams = {
    bill: Bill;
    row: number;
    column: number;
    isParent: boolean;
    groupName: string;
    workSheet: WorkSheet;
    supplierList: Array<string>;
};

export type BuildCreditCardBodyData = {
    data: Record<string, string | number | boolean | object>;
    supplierList: Array<string>;
};

export type GenerateCreditCardTableParams = {
    bills: Array<Bill>;
    startRow: number;
    workSheet: WorkSheet;
    groupName: string;
};

export type GenerateCreditCardTable = {
    data: DataAccumulator;
    nextRow: number;
};

export type ParseToDetailsTableParams = {
    bills: Array<Bill>;
    startRow: number;
    groupName: string;
    workSheet: WorkSheet;
}

export type ParseToDetailsTable = Array<Record<string, string | number | boolean | object>>;

export type ValidateWorkSheetToBuild = {
    nextRow: number;
    totalRows: number;
};

export type BuildFromCreditCardSheet = {
    year: number;
    value: number;
    month: EMonth;
    supplier: string;
    instalment_number: number;
}