import type { INestModuleConfig } from '../../../types';
import { NestModuleAbstract } from '../../../abstract';

import type { ICreateExpenseParams, IExpense,  IUpdateExpenseParams } from './types';
import type { IQueryParameters } from '../../../../types';

export class Expense extends NestModuleAbstract<IExpense, ICreateExpenseParams, IUpdateExpenseParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', subPathUrl: 'expense', nestModuleConfig });
    }

    async create(params: ICreateExpenseParams, by: string = ''): Promise<IExpense> {
        const path = `${this.pathUrl}/${by}/${this.subPathUrl}`;
        return this.post(path, { body: params });
    }

    async update(param: string, params: IUpdateExpenseParams, by: string = ''): Promise<IExpense> {
        const path = `${this.pathUrl}/${by}/${this.subPathUrl}/${param}`;
        return this.path(`${path}`, { body: params });
    }

    async getAllByBill(billId: string, parameters: IQueryParameters) {
        return this.get(`${this.pathUrl}/${billId}/list/${this.subPathUrl}`, { params: parameters });
    }
}