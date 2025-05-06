import type { INestModuleConfig } from '../../../types';
import { NestModuleAbstract } from '../../../abstract';

import type { IBillCategory, ICreateBillCategoryParams, IUpdateBillCategoryParams } from './types';

export class BillCategory extends NestModuleAbstract<IBillCategory, ICreateBillCategoryParams, IUpdateBillCategoryParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({
            pathUrl: 'finance/bill',
            subPathUrl: 'category',
            nestModuleConfig,
        });
    }
}