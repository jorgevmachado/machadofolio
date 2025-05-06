import type { INestModuleConfig } from '../../types';
import { NestModuleAbstract } from '../../abstract';

import type { IBill, ICreateBillParams, IUpdateBillParams } from './types';
import { BillCategory } from './category';
import { Expense } from './expense';

export class Bill extends NestModuleAbstract<IBill, ICreateBillParams, IUpdateBillParams> {
    private readonly expenseModule: Expense;
    private readonly billCategoryModule: BillCategory;
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', nestModuleConfig });
        this.billCategoryModule = new BillCategory(nestModuleConfig);
        this.expenseModule = new Expense(nestModuleConfig);
    }

    get category(): BillCategory {
        return this.billCategoryModule;
    }

    get expense(): Expense {
        return this.expenseModule;
    }

}