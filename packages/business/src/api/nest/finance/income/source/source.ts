import { NestModuleAbstract } from '../../../abstract';
import type { INestModuleConfig } from '../../../types';
import type { IIncomeSource, ICreateIncomeSourceParams, IUpdateIncomeSourceParams } from './types';

export class IncomeSource extends NestModuleAbstract<IIncomeSource, ICreateIncomeSourceParams, IUpdateIncomeSourceParams>{
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/incomes', subPathUrl: 'source', nestModuleConfig});
    }
}