import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import type { IBank, ICreateBankParams, IUpdateBankParams } from './types';

export class Bank extends NestModuleAbstract<IBank, ICreateBankParams, IUpdateBankParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'finance', subPathUrl: 'bank', nestModuleConfig });
    }
}