import {
  Column ,
  CreateDateColumn ,
  DeleteDateColumn ,
  Entity ,
  ManyToOne ,
  PrimaryGeneratedColumn ,
  UpdateDateColumn ,
} from 'typeorm';

import { PokedexEntity } from '@repo/business';

import { Pokemon } from './pokemon.entity';
import { PokemonTrainer } from './trainer.entity';

@Entity({ name: 'pokedex' })
export class Pokedex implements PokedexEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  hp!: number;

  @Column({ nullable: false })
  wins!: number;

  @Column({ nullable: false })
  level!: number;

  @Column({ nullable: false ,default: 0 })
  iv_hp!: number;

  @Column({ nullable: false ,default: 0 })
  ev_hp!: number;

  @Column({ nullable: false })
  losses!: number;

  @Column({ nullable: false })
  max_hp!: number;

  @Column({ nullable: false })
  battles!: number;

  @ManyToOne(() => Pokemon ,{ nullable: false })
  pokemon!: Pokemon;

  @Column({ nullable: false ,default: 0 })
  iv_speed!: number;

  @Column({ nullable: false ,default: 0 })
  ev_speed!: number;

  @Column({ nullable: false ,default: 0 })
  iv_attack!: number;

  @Column({ nullable: false ,default: 0 })
  ev_attack!: number;

  @Column({ nullable: false ,default: 0 })
  iv_defense!: number;

  @Column({ nullable: false ,default: 0 })
  ev_defense!: number;

  @Column({ nullable: false })
  experience!: number;

  @Column({ nullable: false })
  pokemon_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ nullable: false })
  discovered!: boolean;

  @ManyToOne(() => PokemonTrainer ,{ nullable: false })
  pokemon_trainer!: PokemonTrainer;

  @Column({ nullable: false ,default: 0 })
  iv_special_attack!: number;

  @Column({ nullable: false ,default: 0 })
  ev_special_attack!: number;

  @Column({ nullable: false ,default: 0 })
  iv_special_defense!: number;

  @Column({ nullable: false ,default: 0 })
  ev_special_defense!: number;
}