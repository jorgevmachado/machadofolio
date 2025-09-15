import type {
    ICreateExpenseParams,
    IExpense,
    IExpenseBase,
    IExpenseMonthsWithPaid,
    IPartialNestBaseEntity,
    IUpdateExpenseParams
} from '../../api';

export type ExpenseEntity = IExpense;

export type ExpenseConstructorParams
    = Omit<IExpenseBase, 'id' | 'year' | 'paid' | 'name' | 'total' | 'total_paid' | 'instalment_number' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'>
    & IPartialNestBaseEntity
    & Partial<IExpenseMonthsWithPaid>
    & Pick<ExpenseEntity, 'is_aggregate' | 'children' | 'parent' | 'aggregate_name'>
    & {
    paid?: boolean;
    year?: number;
    total?: number;
    total_paid?: number;
    instalment_number?: number;
};


export type CreateExpenseParams = ICreateExpenseParams;

export type UpdateExpenseParams = IUpdateExpenseParams;

export type InitializedExpense = {
    nextYear: number;
    requiresNewBill: boolean;
    monthsForNextYear?: Array<string>;
    expenseForNextYear?: ExpenseEntity;
    monthsForCurrentYear?: Array<string>;
    expenseForCurrentYear: ExpenseEntity;
}

export type TMonthPaid =
    | 'january_paid'
    | 'february_paid'
    | 'march_paid'
    | 'april_paid'
    | 'may_paid'
    | 'june_paid'
    | 'july_paid'
    | 'august_paid'
    | 'september_paid'
    | 'october_paid'
    | 'november_paid'
    | 'december_paid';