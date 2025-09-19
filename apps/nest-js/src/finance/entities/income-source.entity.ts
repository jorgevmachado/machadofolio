import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import type { IncomeSourceEntity } from '@repo/business';

import { Income } from './incomes.entity';

@Entity({ name: 'income_sources' })
export class IncomeSource implements IncomeSourceEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, length: 200 })
    name!: string;

    @OneToMany(() => Income, (income) => income.source)
    incomes?: Array<Income>;

    @Column({ nullable: false, length: 200 })
    name_code!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}