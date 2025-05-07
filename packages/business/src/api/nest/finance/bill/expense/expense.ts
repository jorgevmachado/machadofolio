import type { INestModuleConfig } from '../../../types';
import { NestModuleAbstract } from '../../../abstract';

import type { IExpense, IExpenseCreateParams,  IExpenseUpdateParams } from './types';

export class Expense extends NestModuleAbstract<IExpense, IExpenseCreateParams, IExpenseUpdateParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', subPathUrl: 'expense', nestModuleConfig });
    }
}