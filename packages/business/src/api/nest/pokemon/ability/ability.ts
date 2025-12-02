import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import type { IAbility } from './types';

export class Ability extends NestModuleAbstract<IAbility, unknown, unknown> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({
            pathUrl: 'pokemon',
            subPathUrl: 'ability',
            nestModuleConfig,
        });
    }
}