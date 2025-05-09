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