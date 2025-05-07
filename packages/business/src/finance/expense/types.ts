import type { IExpense, IExpenseCreateParams, IExpenseUpdateParams, IPartialNestBaseEntity } from '../../api';

export type ExpenseEntity = IExpense;

export type ExpenseConstructorParams = Omit< ExpenseEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type ExpenseCreateParams = IExpenseCreateParams;

export type ExpenseUpdateParams = IExpenseUpdateParams;