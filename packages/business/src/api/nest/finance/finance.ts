import { NestModuleAbstract } from '../abstract';
import type { INestModuleConfig } from '../types';

import { Bank } from './bank';
import { Bill } from './bill';
import { Group } from './group';
import { Income } from './income';
import { Supplier } from './supplier';
import type { IFinance, IFinanceInfo } from './types';

export class Finance extends NestModuleAbstract<IFinance, unknown, unknown> {
    private readonly billModule: Bill;
    private readonly bankModule: Bank;
    private readonly groupModule: Group;
    private readonly incomeModule: Income;
    private readonly supplierModule: Supplier;

    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance', nestModuleConfig });
        this.billModule = new Bill(nestModuleConfig);
        this.bankModule = new Bank(nestModuleConfig);
        this.groupModule = new Group(nestModuleConfig);
        this.incomeModule = new Income(nestModuleConfig);
        this.supplierModule = new Supplier(nestModuleConfig);
    }

    get bill(): Bill {
        return this.billModule;
    }

    get bank(): Bank {
        return this.bankModule;
    }

    get group(): Group {
        return this.groupModule;
    }

    get income(): Income {
        return this.incomeModule;
    }

    get supplier(): Supplier {
        return this.supplierModule;
    }

    async initialize(): Promise<IFinance> {
        return this.post('finance');
    }

    async find(): Promise<IFinanceInfo> {
        return this.get('finance');
    }
}