import { AuthService } from '@repo/business/auth/service';
import { Nest } from '@repo/business/api/nest';

import { getAccessToken } from '../cookies';

const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3001';

const token = getAccessToken() || '';

const nest = new Nest({
    token,
    baseUrl,
});

export const authService = new AuthService(nest);