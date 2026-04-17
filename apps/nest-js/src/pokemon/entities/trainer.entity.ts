import {
  Column ,
  CreateDateColumn ,
  DeleteDateColumn ,
  Entity ,
  OneToMany ,
  OneToOne ,
  PrimaryGeneratedColumn ,
  UpdateDateColumn ,
} from 'typeorm';

import type { PokemonTrainerEntity } from '@repo/business';

import { User } from '../../auth/entities/user.entity';

import { CapturedPokemon } from './captured-pokemons.entity';
import { Pokedex } from './pokedex.entity';


@Entity({ name: 'pokemon_trainers' })
export class PokemonTrainer implements PokemonTrainerEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User ,(user) => user.pokemon_trainer)
  user!: User;

  @OneToMany(() => Pokedex ,
    (pokedex) => pokedex.pokemon_trainer)
  pokedex?: Array<Pokedex>;

  @Column({ nullable: false, default: 5 })
  pokeballs!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ nullable: true })
  capture_rate?: number;

  @OneToMany(() => CapturedPokemon ,
    (capturedPokemons) => capturedPokemons.trainer)
  captured_pokemons?: Array<CapturedPokemon>;
}