import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import { type IGrowth } from './types';

export class Growth extends NestModuleAbstract<IGrowth ,unknown ,unknown>{
  constructor(nestModuleConfig: INestModuleConfig) {
    super({
      pathUrl: 'pokemon',
      subPathUrl: 'growth',
      nestModuleConfig,
    });
  }
}