import type { INestModuleConfig } from '../types';
import { NestModuleAbstract } from '../abstract';

import type { IFinance, IFinanceInfo } from './types';

import { Bank } from './bank';
import { Bill } from './bill';
import { Group } from './group';
import { Supplier } from './supplier';

export class Finance extends NestModuleAbstract<IFinance, unknown, unknown> {
    private readonly bankModule: Bank;
    private readonly groupModule: Group;
    private readonly billModule: Bill;
    private readonly supplierModule: Supplier;

    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance', nestModuleConfig });
        this.bankModule = new Bank(nestModuleConfig);
        this.groupModule = new Group(nestModuleConfig);
        this.billModule = new Bill(nestModuleConfig);
        this.supplierModule = new Supplier(nestModuleConfig);
    }

    get bank(): Bank {
        return this.bankModule;
    }

    get group(): Group {
        return this.groupModule;
    }

    get supplier(): Supplier {
        return this.supplierModule;
    }

    get bill(): Bill {
        return this.billModule;
    }

    async initialize(): Promise<IFinance> {
        return this.post('finance/initialize');
    }

    async find(): Promise<IFinanceInfo> {
        return this.get('finance');
    }
}