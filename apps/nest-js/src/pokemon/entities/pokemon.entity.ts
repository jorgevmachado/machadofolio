import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

import { EStatus } from '@repo/business/enum';
import type { PokemonEntity } from '@repo/business/pokemon/types';

import { PokemonAbility } from './ability.entity';
import { PokemonMove } from './move.entity';
import { PokemonType } from './type.entity';

@Entity({ name: 'pokemons' })
export class Pokemon implements PokemonEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true })
    hp?: number;

    @Column({ nullable: false, length: 50 })
    url!: string;

    @Column({ nullable: false, length: 200 })
    name!: string;

    @Column({ nullable: false })
    order!: number;

    @Column({ nullable: true, length: 200 })
    image?: string;

    @Column({ nullable: true })
    speed?: number;

    @ManyToMany(() => PokemonMove, { nullable: true })
    @JoinTable()
    moves?: Array<PokemonMove>;

    @ManyToMany(() => PokemonType, { nullable: true })
    @JoinTable()
    types?: Array<PokemonType>;

    @Column({ nullable: false, default: EStatus.INCOMPLETE })
    status!: EStatus;

    @Column({ nullable: true })
    attack?: number;

    @Column({ nullable: true })
    defense?: number;

    @Column({ nullable: true })
    habitat?: string;

    @Column({ nullable: true })
    is_baby?: boolean;

    @Column({ nullable: true, length: 50 })
    shape_url?: string;

    @ManyToMany(() => PokemonAbility, { nullable: true })
    @JoinTable()
    abilities?: Array<PokemonAbility>;

    @ManyToMany(() => Pokemon, { nullable: true })
    @JoinTable()
    evolutions?: Array<Pokemon>;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ nullable: true, length: 200 })
    shape_name?: string;

    @Column({ nullable: true })
    is_mythical?: boolean;

    @Column({ nullable: true })
    gender_rate?: number;

    @Column({ nullable: true })
    is_legendary?: boolean;

    @Column({ nullable: true })
    capture_rate?: number;

    @Column({ nullable: true })
    hatch_counter?: number;

    @Column({ nullable: true })
    base_happiness?: number;

    @Column({ nullable: true })
    special_attack?: number;

    @Column({ nullable: true })
    special_defense?: number;

    @Column({ nullable: true })
    evolution_chain_url?: string;

    @Column({ nullable: true })
    evolves_from_species?: string;

    @Column({ nullable: true })
    has_gender_differences?: boolean;
}
