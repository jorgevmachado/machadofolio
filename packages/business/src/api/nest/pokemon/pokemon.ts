import { NestModuleAbstract } from '../abstract';
import type { INestModuleConfig } from '../types';

import { Ability } from './ability';
import { Captured } from './captured';
import { Move } from './move';
import { type ITrainer ,Trainer } from './trainer';
import { Type } from './type';
import type { IPokemon } from './types';

export class Pokemon extends NestModuleAbstract<IPokemon, unknown, unknown> {
    private readonly abilityModule: Ability;
    private readonly moveModule: Move;
    private readonly typeModule: Type;
    private readonly capturedModule: Captured;
    private readonly trainerModule: Trainer;

    constructor(nestModuleConfig: INestModuleConfig) {
        super({ pathUrl: 'pokemon', nestModuleConfig });
        this.abilityModule = new Ability(nestModuleConfig);
        this.moveModule = new Move(nestModuleConfig);
        this.typeModule = new Type(nestModuleConfig);
        this.capturedModule = new Captured(nestModuleConfig);
        this.trainerModule = new Trainer(nestModuleConfig);
    }

    get ability(): Ability {
        return this.abilityModule;
    }

    get move(): Move {
        return this.moveModule;
    }

    get type(): Type {
        return this.typeModule;
    }

    get captured(): Captured {
      return this.capturedModule;
    }

    get trainer(): Trainer {
      return this.trainerModule;
    }

    async initialize(pokemon_name?: string): Promise<ITrainer> {
      return this.post(`${this.pathUrl}/initialize`, { body: { pokemon_name } });
    }
}