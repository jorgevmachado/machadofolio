import { NestModuleAbstract } from '../../abstract';
import { type INestModuleConfig } from '../../types';

import type { ITrainer } from './types';

export class Trainer extends NestModuleAbstract<ITrainer ,unknown ,unknown>{
  constructor(nestModuleConfig: INestModuleConfig) {
    super({ pathUrl: 'pokemon/trainer' , nestModuleConfig });
  }

  async initialize(pokemonName: string): Promise<ITrainer> {
    return this.post(this.pathUrl, { body: { pokemonName } });
  }
}