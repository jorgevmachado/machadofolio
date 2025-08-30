import { AuthService, BankService, Nest, SupplierService, SupplierTypeService } from '@repo/business';

import { getAccessToken } from '../cookies';

const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3001';

const token = getAccessToken() || '';

const nest = new Nest({
    token,
    baseUrl,
});

export const authService = new AuthService(nest);
export const bankService = new BankService(nest);
export const supplierService = new SupplierService(nest);
export const supplierTypeService = new SupplierTypeService(nest);