import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import type { IType } from './types';

export class Type extends NestModuleAbstract<IType, unknown, unknown> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({
            pathUrl: 'pokemon',
            subPathUrl: 'type',
            nestModuleConfig,
        });
    }
}