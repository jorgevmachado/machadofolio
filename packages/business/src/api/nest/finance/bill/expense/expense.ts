import { type ReplaceWordParam } from '@repo/services';

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

    async upload(billId: string, params: IUploadExpenseParams) {
        const formData = new FormData();

        const list = Object.keys(params);

        for(const key of list) {
            const value = params[key as keyof IUploadExpenseParams];

            switch (key) {
                case 'file':
                    const file = value as string;
                    if(file.startsWith('data:')) {
                        const base64Response = await fetch(file);
                        const blob = await base64Response.blob();
                        formData.append('file', blob, 'upload.xlsx');
                    }
                    break;
                case 'replaceWords':
                    if(Array.isArray(value)) {
                        const currentValue = value as Array<ReplaceWordParam>;
                        const replaceWords = currentValue.map((item) => JSON.stringify(item)).join(',');
                        formData.append('replaceWords[]', replaceWords);
                    }
                    break;
                case 'repeatedWords':
                    if(Array.isArray(value)) {
                        const repeatedWords = value.join(',');
                        formData.append('repeatedWords[]', repeatedWords);
                    }
                    break;
                case 'month':
                default:
                    formData.append(key, value as string);
                    break;
            }
        }

        return this.post(`${this.pathUrl}/${billId}/${this.subPathUrl}/upload`, { body: formData });
    }
}