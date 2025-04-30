import type { INestConfig } from './types';

import { Auth } from './auth';

export class Nest {
    private readonly authModule: Auth;

    constructor({ baseUrl = 'http://localhost:3000', token = '' }: INestConfig) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        this.authModule = new Auth({ baseUrl, headers });
    }

    get auth(): Auth {
        return this.authModule;
    }
}