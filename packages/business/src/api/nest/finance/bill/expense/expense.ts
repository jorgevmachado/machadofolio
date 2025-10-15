import { type ReplaceWordParam } from '@repo/services';

import type { INestModuleConfig } from '../../../types';
import { NestModuleAbstract } from '../../../abstract';

import {
    ICreateExpenseParams,
    IExpense,
    IUpdateExpenseParams,
    IUploadExpenseParams,
    IUploadsExpenseParams
} from './types';
import type { IQueryParameters } from '../../../../types';

export class Expense extends NestModuleAbstract<IExpense, ICreateExpenseParams, IUpdateExpenseParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', subPathUrl: 'expense', nestModuleConfig });
    }

    async create(params: ICreateExpenseParams, by: string = ''): Promise<IExpense> {
        const path = `${this.pathUrl}/${by}/${this.subPathUrl}`;
        return this.post(path, { body: params });
    }

    async getAllByBill(billId: string, parameters: IQueryParameters) {
        return this.get(`${this.pathUrl}/${billId}/list/${this.subPathUrl}`, { params: parameters });
    }

    async uploads(billId: string, params: IUploadsExpenseParams) {
        const formData = new FormData();

        const list = Object.keys(params);

        for(const key of list) {
            const value = params[key as keyof IUploadExpenseParams];

            switch (key) {
                case 'paid': {
                    if(Array.isArray(value)) {
                        value.forEach((item) => {
                            formData.append('paid[]', String(item));
                        });
                    }
                    break;
                }
                case 'files':
                    if(Array.isArray(value)) {
                        const list = value as Array<string>;
                        for(let i = 0; i < list.length; i++) {
                            const file = list[i];
                            if(file.startsWith('data:')) {
                                const base64Response = await fetch(file);
                                const blob = await base64Response.blob();
                                formData.append(`files`, blob, `upload.xlsx`);
                            }
                        }
                    }
                    break;
                case 'months':
                    if(Array.isArray(value)) {
                        value.forEach((item) => {
                            formData.append('months[]', String(item));
                        });
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
                        value.forEach((item) => {
                            formData.append('repeatedWords[]', String(item));
                        });
                    }
                    break;
                default:
                    formData.append(key, value as string);
                    break;
            }
        }

        return this.post(`${this.pathUrl}/${billId}/${this.subPathUrl}/uploads`, { body: formData });
    }
}