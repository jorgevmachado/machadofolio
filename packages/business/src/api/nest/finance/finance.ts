import type { INestModuleConfig } from '../types';
import { NestModuleAbstract } from '../abstract';

import type { IFinance } from './types';

import { Bank } from './bank';
import { Bill } from './bill';
import { Supplier } from './supplier';

export class Finance extends NestModuleAbstract<IFinance, unknown, unknown> {
    private readonly bankModule: Bank;
    private readonly billModule: Bill;
    private readonly supplierModule: Supplier;

    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance', nestModuleConfig });
        this.bankModule = new Bank(nestModuleConfig);
        this.billModule = new Bill(nestModuleConfig);
        this.supplierModule = new Supplier(nestModuleConfig);
    }

    get bank(): Bank {
        return this.bankModule;
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
}