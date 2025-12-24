import { type ReplaceWordParam ,urlToBlob } from '@repo/services';

import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import { Expense } from './expense';
import {
  type IBill ,
  type ICreateBillParams ,
  type IUpdateBillParams ,
  type IUploadBillParams,
} from './types';

export class Bill extends NestModuleAbstract<IBill, ICreateBillParams, IUpdateBillParams> {
    private readonly expenseModule: Expense;
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/bill', nestModuleConfig });
        this.expenseModule = new Expense(nestModuleConfig);
    }

    get expense(): Expense {
        return this.expenseModule;
    }
    async upload( params: IUploadBillParams): Promise<Array<Bill>> {
      const formData = new FormData();
      if(params.file.startsWith('data:')) {
        const blob = await urlToBlob(params.file);
        formData.append('file', blob, 'upload.xlsx');
      }

      if(params.paid !== undefined) {
        formData.append('paid', String(params.paid));
      }

      if(params?.replaceWords && Array.isArray(params.replaceWords)) {
        const currentValue = params.replaceWords as Array<ReplaceWordParam>;
        const replaceWords = currentValue.map((item) => JSON.stringify(item)).join(',');
        formData.append('replaceWords[]', replaceWords);
      }
      
      if(params?.repeatedWords && Array.isArray(params.repeatedWords)) {
        params.repeatedWords.forEach((item) => {
          formData.append('repeatedWords[]', String(item));
        });
      }
      
      return this.post(`${this.pathUrl}/upload`, { body: formData });
    }

}