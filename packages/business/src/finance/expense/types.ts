import type { ICreateExpenseParams, IExpense, IPartialNestBaseEntity, IUpdateExpenseParams } from '../../api';

export type ExpenseEntity = IExpense;

export type ExpenseConstructorParams = Omit< ExpenseEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateExpenseParams = ICreateExpenseParams;

export type UpdateExpenseParams = IUpdateExpenseParams;