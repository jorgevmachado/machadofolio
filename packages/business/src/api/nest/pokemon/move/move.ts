import type { INestModuleConfig } from '../../types';
import { NestModuleAbstract } from '../../abstract';

import type { IMove } from './types';

export class Move extends NestModuleAbstract<IMove, unknown, unknown> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({
            pathUrl: 'pokemon',
            subPathUrl: 'move',
            nestModuleConfig,
        });
    }
}