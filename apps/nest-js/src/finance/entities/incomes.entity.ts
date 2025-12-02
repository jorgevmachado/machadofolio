import { IncomeEntity } from '@repo/business';

import { DecimalTransformer } from '../../transforms/decimal';

import { Finance } from './finance.entity';
import { IncomeSource } from './income-source.entity';
import { Month } from './month.entity';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'incomes' })
export class Income implements IncomeEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false })
    year!: number;

    @Column({ nullable: false, length: 200 })
    name!: string;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    total!: number;

    @OneToMany(() => Month, (expenseMonth) => expenseMonth.income)
    months?: Array<Month>;

    @ManyToOne(() => IncomeSource, (source) => source.incomes, { nullable: false })
    source!: IncomeSource;

    @ManyToOne(() => Finance, (finance) => finance.incomes, { nullable: false })
    finance!: Finance;

    @Column({ nullable: false, unique: true, length: 200 })
    name_code!: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}