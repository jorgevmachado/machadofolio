import type { INestModuleConfig } from '../../../types';
import { NestModuleAbstract } from '../../../abstract';

import type { ICreateExpenseParams, IExpense,  IUpdateExpenseParams } from './types';

export class Expense extends NestModuleAbstract<IExpense, ICreateExpenseParams, IUpdateExpenseParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', subPathUrl: 'expense', nestModuleConfig });
    }
}