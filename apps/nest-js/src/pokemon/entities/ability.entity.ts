import type { PokemonAbilityEntity } from '@repo/business';

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'pokemon_abilities' })
export class PokemonAbility implements PokemonAbilityEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, length: 50 })
    url!: string;

    @Column({ nullable: false, length: 200 })
    name!: string;

    @Column({ nullable: false })
    order!: number;

    @Column({ nullable: false })
    slot!: number;

    @Column({ nullable: false })
    is_hidden!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}