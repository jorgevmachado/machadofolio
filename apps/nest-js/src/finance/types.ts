import { type User } from '../auth/entities/user.entity';
import { type SeedsResultItem } from '../shared';


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
    user?: User;
    users: Array<User>;
}
export type FinanceSeedsResult = {
    bank: SeedsResultItem;
    bill: SeedsResultItem;
    group: SeedsResultItem;
    months: SeedsResultItem;
    income: SeedsResultItem;
    expense: SeedsResultItem;
    finance: SeedsResultItem;
    supplier: SeedsResultItem;
    incomeSource: SeedsResultItem;
    supplierType: SeedsResultItem;
}