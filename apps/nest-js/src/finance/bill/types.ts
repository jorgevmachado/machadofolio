import type {
    SpreadsheetProcessingParams as SpreadsheetProcessingBusinessParams
} from '@repo/business';

import type { Bank } from '../entities/bank.entity';
import type { Finance } from '../entities/finance.entity';
import type { Group } from '../entities/group.entity';

import type { FinanceSeederParams } from '../types';

export type ExistExpenseInBill = {
    year?: number;
    nameCode: string;
    withThrow?: boolean;
    fallBackMessage?: string;
}

export type BillSeederParams = Pick<FinanceSeederParams, 'billListJson'> & {
    banks: Array<Bank>;
    groups: Array<Group>;
    finance: Finance;
}

export type SpreadsheetProcessingParams = Pick<SpreadsheetProcessingBusinessParams, 'sheet' | 'startRow' | 'tableWidth' | 'groupsName' | 'startColumn'> & {
    year?: number;
    groupId: string;
    groupName: string;
}

export type CreateToSheetParams = {
    finance: Finance;
} & Record<string, string | number | boolean | object>