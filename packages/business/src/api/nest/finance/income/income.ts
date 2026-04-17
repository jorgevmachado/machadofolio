import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import { IncomeSource } from './source';
import type { ICreateIncomeParams, IIncome, IUpdateIncomeParams } from './types';

export class Income extends NestModuleAbstract<IIncome, ICreateIncomeParams, IUpdateIncomeParams>{
    private readonly incomeSourceModule: IncomeSource;
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/incomes', nestModuleConfig });
        this.incomeSourceModule = new IncomeSource(nestModuleConfig);
    }

    get source(): IncomeSource {
        return this.incomeSourceModule;
    }
}