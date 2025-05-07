import type { INestConfig } from './types';

import { Auth } from './auth';
import { Finance } from './finance';

export class Nest {
    private readonly authModule: Auth;
    private readonly financeModule: Finance;

    constructor({ baseUrl = 'http://localhost:3000', token = '' }: INestConfig) {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        this.authModule = new Auth({ baseUrl, headers });
        this.financeModule = new Finance({ baseUrl, headers });
    }

    get auth(): Auth {
        return this.authModule;
    }

    get finance(): Finance {
        return this.financeModule;
    }
}