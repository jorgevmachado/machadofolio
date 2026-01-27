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

  @ManyToOne(() => Pokemon ,{ nullable: false })
  pokemon!: Pokemon;

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
}