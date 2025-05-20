import type { INestModuleConfig } from '../../types';
import { NestModuleAbstract } from '../../abstract';

import type { ICreateGroupParams, IGroup, IUpdateGroupParams } from './types';

export class Group extends NestModuleAbstract<IGroup, ICreateGroupParams, IUpdateGroupParams> {
    constructor(nestModuleConfig: INestModuleConfig) {
        super({
            pathUrl: 'finance',
            subPathUrl: 'group',
            nestModuleConfig,
        });
    }
}