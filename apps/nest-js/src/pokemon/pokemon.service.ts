import { Repository } from 'typeorm';

import {
  calculateWithFormula ,
  getExperience,
} from '@repo/services';

import {
  BattleResult ,
  EStatus ,
  type PaginateParameters ,
  PokeApiService ,
  PokemonBusiness ,
} from '@repo/business';

import { User } from '../auth/entities/user.entity';
import {
  type FindOneByParams ,
  ListParams ,
  SeedsGenerated ,
  Service ,
} from '../shared';

import { PokemonAbilityService } from './ability/ability.service';
import { CapturedPokemonService } from './captured/captured.service';
import { BattleDto } from './dto/batle.dto';
import { CreatePokemonSeedsDto } from './dto/create-pokemon-seeds.dto';
import { InitializeTrainerDto } from './dto/initialize-trainer.dto';
import { PokemonAbility } from './entities/ability.entity';
import { CapturedPokemon } from './entities/captured-pokemons.entity';
import { PokemonMove } from './entities/move.entity';
import { Pokedex } from './entities/pokedex.entity';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonTrainer } from './entities/trainer.entity';
import { PokemonType } from './entities/type.entity';
import { PokemonGrowthRateService } from './growth-rate/growth-rate.service';
import { PokemonMoveService } from './move/move.service';
import { PokedexService } from './pokedex/pokedex.service';
import { PokemonTrainerService } from './trainer/trainer.service';
import { PokemonTypeService } from './type/type.service';

import { BadRequestException ,Injectable  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type AddPokemonParams = {
  trainer: PokemonTrainer;
  addPokemon: InitializeTrainerDto;
}

type EncounterAction =  'FIGHT' | 'RUN';

type EncounterWildPokemonParams = {
  action: EncounterAction;
  trainer: PokemonTrainer;
}

type LevelUpParam = {
  level: number;
  ev_hp: number;
  formula?: string;
  ev_speed: number;
  ev_attack: number;
  ev_defense: number;
  experience: number;
  ev_special_attack: number;
  ev_special_defense: number;
}

type LevelUpParams = {
  defender: LevelUpParam;
  opponent: LevelUpParam;
};

type CalculateExperienceForLevelParams = {
  level: number;
  formula?: string;
  experience: number;

  defender_ev_hp: number;
  opponent_ev_hp: number;

  defender_ev_speed: number;
  opponent_ev_speed: number;

  defender_ev_attack: number;
  opponent_ev_attack: number;

  defender_ev_defense: number;
  opponent_ev_defense: number;

  defender_ev_special_attack: number;
  opponent_ev_special_attack: number;

  defender_ev_special_defense: number;
  opponent_ev_special_defense: number;
}

@Injectable()
export class PokemonService extends Service<Pokemon> {
  constructor(
    @InjectRepository(Pokemon)
    protected repository: Repository<Pokemon> ,
    protected pokeApiService: PokeApiService ,
    protected pokedexService: PokedexService ,
    protected pokemonBusiness: PokemonBusiness ,
    protected pokemonMoveService: PokemonMoveService ,
    protected pokemonTypeService: PokemonTypeService ,
    protected pokemonAbilityService: PokemonAbilityService ,
    protected pokemonTrainerService: PokemonTrainerService ,
    protected capturedPokemonService: CapturedPokemonService ,
    protected pokemonGrowthRateService: PokemonGrowthRateService ,
  ) {
    super('pokemons' ,['moves' ,'types' ,'abilities' ,'evolutions', 'growth_rate'] ,
      repository);
  }

  async initialize(user: User ,{ pokemon_name }: InitializeTrainerDto) {
    if (user.pokemon_trainer) {
      return {
        ...user.pokemon_trainer,
        user,
      };
    }

    const pokemons = await this.findAll({}) as Array<Pokemon>;

    const trainer = await this.pokemonTrainerService.create(user) as PokemonTrainer;

    const firstPokemon = this.pokemonBusiness.firstTrainerPokemon(pokemons ,pokemon_name);

    if (firstPokemon) {
      const pokemon = await this.findOne({ value: firstPokemon.name }) as Pokemon;
      await this.pokedexService.initialize({ pokemons ,pokemonTrainer: trainer ,pokemon }) as Array<Pokedex>;
      await this.capturedPokemonService.create({ trainer ,pokemon ,nickname: pokemon.name }) as CapturedPokemon;
      return await this.pokemonTrainerService.findOne({ value: trainer.id ,withRelations: true });
    }

    return trainer;
  }

  async findAll(listParams: ListParams): Promise<Array<Pokemon> | PaginateParameters<Pokemon>> {
    await this.validateDatabase();
    return super.findAll({ ...listParams ,withRelations: true });
  }

  private async createList(list: Array<Pokemon>) {
    return Promise.all(list.map((item: Pokemon) => this.save(item))).
    then().
    catch((error) => this.error(error));
  }

  private async validateDatabase(): Promise<void> {
    const total = await this.repository.count();

    if (total !== this.pokeApiService.limit) {
      const externalPokemonList = await this.pokeApiService.getAll({}).
      then((response) => response).
      catch(() => {
        throw this.error(
          new BadRequestException(
            'Failed to execute external request.',
          ) ,
        );
      });

      if (total === 0) {
        await this.createList(externalPokemonList);
        return;
      }

      const entities = (await this.repository.find()) ?? [];

      const saveList = externalPokemonList.filter(
        (item) => !entities.find((database) => database.name === item.name) ,
      );

      await this.createList(saveList);
    }
  }

  async findOne(findOneByParams: FindOneByParams) {
    return await this.validateEntity(findOneByParams.value);
  }

  private async validateEntity(value: string ,complete: boolean = true) {
    const result = await this.queries.findOne(
      { value ,condition: '=' ,withRelations: true });

    if (result?.status === EStatus.COMPLETE) {
      return result;
    }

    if (!complete) {
      return result;
    }

    return this.completingPokemonData(result as Pokemon);
  }

  private async completingPokemonData(result: Pokemon) {
    const entity = await this.pokeApiService.getByName(result);
    entity.moves = await this.pokemonMoveService.findList(entity?.moves);
    entity.types = await this.pokemonTypeService.findList(entity?.types);
    entity.abilities = await this.pokemonAbilityService.findList(entity?.abilities);
    entity.growth_rate = await this.pokemonGrowthRateService.find(entity?.growth_rate);
    entity.evolutions = await this.findEvolutions(entity.evolution_chain_url);
    entity.status = EStatus.COMPLETE;
    await this.save(entity);
    return await this.validateEntity(entity.name ,false);
  }

  private async findEvolutions(url?: string): Promise<Array<Pokemon> | undefined> {
    if (!url) {
      return;
    }
    const response = await this.pokeApiService.getEvolutions(url);
    const result = await Promise.all(
      response.map(async (name) => await this.validateEntity(name ,false)) ,
    );
    return result?.filter((value) => value !== undefined);
  }

  async capturePokemon({ trainer ,addPokemon }: AddPokemonParams) {
    const pokemon = await this.findOne({ value: addPokemon.pokemon_name, withRelations: true }) as Pokemon;
    const pokemonDiscovered = await this.pokedexService.hasPokemonBeenDiscovered({ pokemon ,trainer });
    if(!pokemonDiscovered) {
      throw this.error(new BadRequestException('Pokemon not discovered yet.'));
    }
    const trainerCaptureRate = trainer.capture_rate ?? 0;
    const pokemonCaptureRate = pokemon.capture_rate ?? 0;
    if(trainerCaptureRate < pokemonCaptureRate) {
      throw this.error(new BadRequestException('Trainer capture rate is lower than pokemon capture rate.'));
    }
    await this.capturedPokemonService.addToTrainer(trainer ,pokemon, addPokemon?.nickname);
    await this.pokedexService.add({ pokemon ,trainer });
    return await this.pokemonTrainerService.findOne({ value: trainer.id ,withRelations: true });
  }

  async encounterWildPokemon(trainer: PokemonTrainer) {
    const pokemons = await this.pokedexService.getAllPokemons(trainer, 'WILD');
    const randomIndex = Math.floor(Math.random() * pokemons.length);
    const randomPokemon = pokemons[randomIndex] as Pokemon;
    const pokemon = await this.findOne({ value: randomPokemon.name, withRelations: true }) as Pokemon;
    await this.pokedexService.add({ pokemon ,trainer });
    return pokemon;
  }

  async battle(trainer: PokemonTrainer, { pokemon, pokemon_move, wild_pokemon }: BattleDto) {
    const wildPokemon = await this.findOne({value: wild_pokemon, withRelations: true}) as Pokemon;
    const pokedex = await this.pokedexService.findOnePokedex({ pokemon: wildPokemon ,trainer });
    if(!pokedex || !pokedex.discovered) {
      throw this.error(new BadRequestException(`Pokemon ${wildPokemon.name} not discovered yet.`));
    }

    const trainerPokemon = await this.findOne({value: pokemon, withRelations: true}) as Pokemon;

    const capturedPokemon = await this.capturedPokemonService.findOneCapturedPokemon({ trainer ,pokemon: trainerPokemon });
    if(!capturedPokemon) {
      throw this.error(new BadRequestException(`Pokemon ${trainerPokemon.name} not captured yet.`));
    }

    console.log('# => capturedPokemon => ev_hp => ', capturedPokemon.ev_hp)
    console.log('# => capturedPokemon => ev_attack => ', capturedPokemon.ev_attack)

    const trainerPokemonMove = trainerPokemon.moves?.find((move) => move.name === pokemon_move);
    if(!trainerPokemonMove) {
      throw this.error(new BadRequestException(`Pokemon ${trainerPokemon.name} does not have move ${pokemon_move}.`));
    }

    const battleResult: BattleResult = {
      level: capturedPokemon.level ,
      winner: 'DRAW' ,
      experience: 0 ,
      wild_pokemon_hp: 0 ,
      trainer_pokemon_hp: 0 ,
      wild_pokemon_damage: 0 ,
      trainer_pokemon_damage: 0,
    };

    const trainerPokemonDamage = this.pokemonBusiness.battle.calculateTrainerPokemonDamage({
      level: battleResult.level ,
      power: trainerPokemonMove.power ,
      attack: trainerPokemon.attack ,
      defense: trainerPokemon.defense ,
      iv_attack: capturedPokemon.iv_attack ,
      ev_attack: capturedPokemon.ev_attack ,
      iv_defense: capturedPokemon.iv_defense ,
      ev_defense: capturedPokemon.ev_defense ,
    })
    battleResult.wild_pokemon_hp = wildPokemon.hp ?? 0 - trainerPokemonDamage;

    const wildPokemonDamage = this.pokemonBusiness.battle.calculateWildPokemonDamage({
      level: battleResult.level ,
      moves: wildPokemon?.moves ,
      attack: wildPokemon?.attack ,
      defense: wildPokemon?.defense,
    });
    battleResult.trainer_pokemon_hp = capturedPokemon.hp - wildPokemonDamage;

    battleResult.winner = this.pokemonBusiness.battle.calculateWinner(battleResult.trainer_pokemon_hp ,battleResult.wild_pokemon_hp);

    const capturedPokemonLevelUpBefore = {
      level: capturedPokemon.level ,
      ev_hp: capturedPokemon.ev_hp,
      formula: trainerPokemon.growth_rate?.formula,
      ev_speed: capturedPokemon.ev_speed,
      ev_attack: capturedPokemon.ev_attack,
      ev_defense: capturedPokemon.ev_defense,
      experience: capturedPokemon.experience,
      ev_special_attack: capturedPokemon.ev_special_attack,
      ev_special_defense: capturedPokemon.ev_special_defense,
    }
    console.log('# => capturedPokemonLevelUpBefore => ', capturedPokemonLevelUpBefore)

    const wildPokemonLevelUpBefore = {
      level: pokedex.level ,
      ev_hp: pokedex.ev_hp,
      formula: wildPokemon.growth_rate?.formula,
      ev_speed: pokedex.ev_speed,
      ev_attack: pokedex.ev_attack,
      ev_defense: pokedex.ev_defense,
      experience: pokedex.experience,
      ev_special_attack: pokedex.ev_special_attack,
      ev_special_defense: pokedex.ev_special_defense,
    }

    console.log('# => wildPokemonLevelUpBefore => ', wildPokemonLevelUpBefore)


    const capturedPokemonLevelUp = this.levelUp({
      defender: capturedPokemonLevelUpBefore,
      opponent: wildPokemonLevelUpBefore
    });

    console.log('# => capturedPokemonLevelUpAfter => ', capturedPokemonLevelUp.defender)
    console.log('# => wildPokemonLevelUpAfter => ', capturedPokemonLevelUp.opponent)

    // return await this.capturedPokemonService.battle(trainer, wildPokemon, trainerPokemon, pokemon_move);
    return battleResult;
  }

  private levelUp({ defender, opponent }: LevelUpParams){
    // const defenderExpGain = Math.floor(opponent.experience / 7);
    // const opponentExpGain = Math.floor(defender.experience / 7);
    //
    // const resultLevelUp = {
    //   opponent_level: opponent.level,
    //   defender_level: defender.level,
    //   defender_experience: defender.experience + defenderExpGain,
    //   opponent_experience: opponent.experience + opponentExpGain,
    // }

    // const getExperienceForLevel = (value: number, formula?: string): number => {
    //   const result = calculateWithFormula(value, formula);
    //   return <number>result.value;
    // }
    //
    // console.log('# => resultLevelUp => defender_experience => ', resultLevelUp.defender_experience)
    // console.log('# => resultLevelUp => defender_level => ', resultLevelUp.defender_level)
    //
    // while (resultLevelUp.defender_experience >= getExperienceForLevel(defender.level + 1, defender.formula)) {
    //   resultLevelUp.defender_level += 1;
    // }
    //
    // const newDefenderEnvHp = defender.ev_hp + opponent.ev_hp;
    // const newDefenderEnvSpeed = defender.ev_speed + opponent.ev_speed;
    // const newDefenderEnvAttack = defender.ev_attack + opponent.ev_attack;
    // const newDefenderEnvDefense = defender.ev_defense + opponent.ev_defense;
    // const newDefenderEnvSpecialAttack = defender.ev_special_attack + opponent.ev_special_attack;
    // const newDefenderEnvSpecialDefense = defender.ev_special_defense + opponent.ev_special_defense;
    //
    // while (resultLevelUp.opponent_experience >= getExperienceForLevel(opponent.level + 1, opponent.formula)) {
    //   resultLevelUp.opponent_level += 1;
    // }
    //
    // console.log('# => resultLevelUp => defender_experience => ', resultLevelUp.opponent_experience)
    // console.log('# => resultLevelUp => defender_level => ', resultLevelUp.opponent_level)
    //
    // const newOpponentEnvHp = opponent.ev_hp + defender.ev_hp;
    // const newOpponentEnvSpeed = opponent.ev_speed + defender.ev_speed;
    // const newOpponentEnvAttack = opponent.ev_attack + defender.ev_attack;
    // const newOpponentEnvDefense = opponent.ev_defense + defender.ev_defense;
    // const newOpponentEnvSpecialAttack = opponent.ev_special_attack + defender.ev_special_attack;
    // const newOpponentEnvSpecialDefense = opponent.ev_special_defense + defender.ev_special_defense;

    return {
      defender: this.businessCalculateExperienceForLevel({
        level: defender.level,
        formula: defender.formula,
        experience: Math.floor(opponent.experience / 7),
        defender_ev_hp: defender.ev_hp,
        opponent_ev_hp: opponent.ev_hp,
        defender_ev_speed: defender.ev_speed,
        opponent_ev_speed: opponent.ev_speed,
        defender_ev_attack: defender.ev_attack,
        opponent_ev_attack: opponent.ev_attack,
        defender_ev_defense: defender.ev_defense,
        opponent_ev_defense: opponent.ev_defense,
        defender_ev_special_attack: defender.ev_special_attack,
        opponent_ev_special_attack: opponent.ev_special_attack,
        defender_ev_special_defense: defender.ev_special_defense,
        opponent_ev_special_defense: opponent.ev_special_defense
      }),
      opponent: this.businessCalculateExperienceForLevel({
        level: opponent.level,
        formula: opponent.formula,
        experience: Math.floor(defender.experience / 7),
        defender_ev_hp: opponent.ev_hp,
        opponent_ev_hp: defender.ev_hp,
        defender_ev_speed: opponent.ev_speed,
        opponent_ev_speed: defender.ev_speed,
        defender_ev_attack: opponent.ev_attack,
        opponent_ev_attack: defender.ev_attack,
        defender_ev_defense: opponent.ev_defense,
        opponent_ev_defense: defender.ev_defense,
        defender_ev_special_attack: opponent.ev_special_attack,
        opponent_ev_special_attack: defender.ev_special_attack,
        defender_ev_special_defense: opponent.ev_special_defense,
        opponent_ev_special_defense: defender.ev_special_defense
      })
    }
  }

  private businessCalculateExperienceForLevel({
    level,
    formula,
    experience,
    defender_ev_hp,
    opponent_ev_hp,
    defender_ev_speed,
    opponent_ev_speed,
    defender_ev_attack,
    opponent_ev_attack,
    defender_ev_defense,
    opponent_ev_defense,
    defender_ev_special_attack,
    opponent_ev_special_attack,
    defender_ev_special_defense,
    opponent_ev_special_defense
  }: CalculateExperienceForLevelParams): LevelUpParam {
    return {
      level: this.nextLevel(level, experience, formula),
      ev_hp: defender_ev_hp + opponent_ev_hp,
      formula,
      ev_speed: defender_ev_speed + opponent_ev_speed,
      ev_attack: defender_ev_attack + opponent_ev_attack,
      ev_defense: defender_ev_defense + opponent_ev_defense,
      experience,
      ev_special_attack: defender_ev_special_attack + opponent_ev_special_attack,
      ev_special_defense: defender_ev_special_defense + opponent_ev_special_defense,
    }
  }

  private getExperienceForLevel(value: number, formula?: string): number {
    const result = calculateWithFormula(value, formula);
    return typeof result.value === 'number' && !isNaN(result.value) ? result.value : Infinity;
  }

  private canLevelUp(level: number, experience: number, formula?: string): boolean {
    return experience >= this.getExperienceForLevel(level + 1, formula);
  }

  private nextLevel(level: number, experience: number, formula?: string): number {
    return this.canLevelUp(level, experience, formula) ? this.nextLevel(level + 1, experience, formula) : level;
  }

}