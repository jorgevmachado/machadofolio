import type { INestModuleConfig } from '../../types';
import { NestModuleAbstract } from '../../abstract';

import type { IBill, ICreateBillParams, IUpdateBillParams } from './types';
import { Expense } from './expense';

export class Bill extends NestModuleAbstract<IBill, ICreateBillParams, IUpdateBillParams> {
    private readonly expenseModule: Expense;
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', nestModuleConfig });
        this.expenseModule = new Expense(nestModuleConfig);
    }

    get expense(): Expense {
        return this.expenseModule;
    }

}