import {
  Column ,
  CreateDateColumn ,
  DeleteDateColumn ,
  Entity ,
  ManyToOne ,
  PrimaryGeneratedColumn ,
  UpdateDateColumn ,
} from 'typeorm';

import { CapturedPokemonEntity } from '@repo/business';

import { Pokemon } from './pokemon.entity';
import { PokemonTrainer } from './trainer.entity';

@Entity({ name: 'captured_pokemons' })
export class CapturedPokemon implements CapturedPokemonEntity {
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

  @ManyToOne(() => PokemonTrainer ,{ nullable: false })
  trainer!: PokemonTrainer;

  @CreateDateColumn()
  captured_at?: Date;

  @Column({ nullable: true ,length: 100 })
  nickname?: string;

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

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ nullable: false ,default: 0 })
  iv_special_attack!: number;

  @Column({ nullable: false ,default: 0 })
  ev_special_attack!: number;

  @Column({ nullable: false ,default: 0 })
  iv_special_defense!: number;

  @Column({ nullable: false ,default: 0 })
  ev_special_defense!: number;
}