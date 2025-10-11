import type { INestModuleConfig } from '../../../types';
import { NestModuleAbstract } from '../../../abstract';

import type { ICreateExpenseParams, IExpense, IUpdateExpenseParams, IUploadExpenseParams } from './types';
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

    async upload(billId: string, file: string, params: IUploadExpenseParams) {
        const formData = new FormData();
        if(file.startsWith('data:')) {
            const base64Response = await fetch(file);
            const blob = await base64Response.blob();
            formData.append('file', blob, 'upload.xlsx');
        }

        Object.keys(params).forEach(key => {
            formData.append(key, params[key as keyof IUploadExpenseParams] as string);
        });

        return this.post(`${this.pathUrl}/${billId}/${this.subPathUrl}/upload`, { body: formData });
    }
}