import { NestModuleAbstract } from '../../abstract';
import type { INestModuleConfig } from '../../types';

import type { ICaptured } from './types';

export class Captured extends NestModuleAbstract<ICaptured ,unknown ,unknown> {
  constructor(nestModuleConfig: INestModuleConfig) {
    super({
      pathUrl: 'pokemon' ,
      subPathUrl: 'captured' ,
      nestModuleConfig ,
    });
  }
}