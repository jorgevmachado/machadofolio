import type {
    IExpense,
    ICreateExpenseParams,
    IUpdateExpenseParams,
    IPartialNestBaseEntity
} from '../../api';

export type ExpenseEntity = IExpense;

export type ExpenseConstructorParams = Omit<
    ExpenseEntity,
    'id' |
    'year' |
    'paid' |
    'name' |
    'total' |
    'name_code' |
    'total_paid' |
    'created_at' |
    'updated_at' |
    'deleted_at' |
    'instalment_number'
> & IPartialNestBaseEntity & {
    paid?: boolean;
    year?: number;
    total?: number;
    total_paid?: number;
    instalment_number?: number;
}

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