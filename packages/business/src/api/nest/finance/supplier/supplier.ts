import type { INestModuleConfig } from '../../types';
import { NestModuleAbstract } from '../../abstract';

import type { ICreateSupplierParams, ISupplier, IUpdateSupplierParams } from './types';

import { SupplierType } from './type';

export class Supplier extends NestModuleAbstract<ISupplier, ICreateSupplierParams, IUpdateSupplierParams> {
    private readonly supplierTypeModule: SupplierType;
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/supplier', nestModuleConfig });
        this.supplierTypeModule = new SupplierType(nestModuleConfig);
    }

    get type(): SupplierType {
        return this.supplierTypeModule;
    }
}