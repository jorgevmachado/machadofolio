import {
  Column ,
  CreateDateColumn ,DeleteDateColumn ,
  Entity ,
  PrimaryGeneratedColumn ,UpdateDateColumn ,
} from 'typeorm';

import { type PokemonGrowthRateEntity } from '@repo/business';

@Entity({ name: 'pokemon_growth_rates' })
export class PokemonGrowthRate implements PokemonGrowthRateEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false ,length: 50 })
  url!: string;

  @Column({ nullable: false ,length: 200 })
  name!: string;

  @Column({ nullable: false })
  order!: number;

  @Column({ nullable: false ,type: 'varchar' ,length: 200 })
  formula!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}