import {
    AuthService,
    BankService,
    BillService,
    ExpenseService,
    FinanceService,
    GroupService,
    Nest,
    SupplierService,
    SupplierTypeService
} from '@repo/business';

import { getAccessToken } from '../cookies';

const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3001';

const token = getAccessToken() || '';

const nest = new Nest({
    token,
    baseUrl,
});

export const authService = new AuthService(nest);
export const financeService = new FinanceService(nest);
export const bankService = new BankService(nest);
export const supplierService = new SupplierService(nest);
export const supplierTypeService = new SupplierTypeService(nest);
export const groupService = new GroupService(nest);
export const billService = new BillService(nest);
export const expenseService = new ExpenseService(nest);