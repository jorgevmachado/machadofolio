import {
  Column ,CreateDateColumn ,
  DeleteDateColumn ,Entity ,ManyToOne ,PrimaryGeneratedColumn ,
  UpdateDateColumn ,
} from 'typeorm';

import { CapturedPokemonEntity } from '@repo/business';

import { Pokemon } from './pokemon.entity';
import { PokemonTrainer } from './trainer.entity';

@Entity({ name: 'captured_pokemons'})
export class CapturedPokemon implements CapturedPokemonEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pokemon, { nullable: false })
  pokemon!: Pokemon;

  @ManyToOne(() => PokemonTrainer, { nullable: false })
  trainer!: PokemonTrainer;

  @CreateDateColumn()
  captured_at?: Date;

  @Column({ nullable: true, length: 100 })
  nickname?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}