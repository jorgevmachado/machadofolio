import { AuthService, FinanceService, Nest } from '@repo/business/index';

import { getAccessToken } from '../cookies';

const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3001';

const token = getAccessToken() || '';

const nest = new Nest({
    token,
    baseUrl,
});

export const authService = new AuthService(nest);
export const financeService = new FinanceService(nest);