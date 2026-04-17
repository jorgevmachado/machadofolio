import { NestModuleAbstract } from '../../../abstract';
import type { INestModuleConfig } from '../../../types';

import type { ICreateSupplierTypeParams, ISupplierType, IUpdateSupplierTypeParams } from './types';

export class SupplierType extends NestModuleAbstract<ISupplierType, ICreateSupplierTypeParams, IUpdateSupplierTypeParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance/supplier', subPathUrl: 'type', nestModuleConfig });
    }
}