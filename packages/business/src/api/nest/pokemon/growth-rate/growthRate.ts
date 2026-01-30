import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import { type IGrowthRate } from './types';

export class GrowthRate extends NestModuleAbstract<IGrowthRate ,unknown ,unknown>{
  constructor(nestModuleConfig: INestModuleConfig) {
    super({
      pathUrl: 'pokemon',
      subPathUrl: 'growth',
      nestModuleConfig,
    });
  }
}