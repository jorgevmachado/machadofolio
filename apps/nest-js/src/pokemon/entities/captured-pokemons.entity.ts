import {
  Column ,CreateDateColumn ,
  DeleteDateColumn ,Entity ,ManyToOne ,PrimaryGeneratedColumn ,
  UpdateDateColumn ,
} from 'typeorm';

import { CapturedPokemonEntity } from '@repo/business';

import { User } from '../../auth/entities/user.entity';

import { Pokemon } from './pokemon.entity';

@Entity({ name: 'captured_pokemons'})
export class CapturedPokemons implements CapturedPokemonEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => Pokemon, { nullable: false })
  pokemon!: Pokemon;

  @CreateDateColumn()
  captured_at!: Date;

  @Column({ nullable: true, length: 100 })
  nickname?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}