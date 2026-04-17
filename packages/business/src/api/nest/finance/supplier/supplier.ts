import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import { SupplierType } from './type';
import type { ICreateSupplierParams, ISupplier, IUpdateSupplierParams } from './types';

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