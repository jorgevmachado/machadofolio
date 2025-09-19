import { type User } from '../auth/entities/user.entity';

export type FinanceSeederParams = {
    billListJson?: Array<unknown>;
    bankListJson?: Array<unknown>;
    groupListJson?: Array<unknown>;
    incomeListJson?: Array<unknown>;
    withReturnSeed?: boolean;
    financeListJson?: Array<unknown>;
    expenseListJson?: Array<unknown>;
    supplierListJson?: Array<unknown>;
    supplierTypeListJson?: Array<unknown>;
    incomeSourceListJson?: Array<unknown>;
}

export type FinanceSeedsParams = FinanceSeederParams & {
    users: Array<User>;
}