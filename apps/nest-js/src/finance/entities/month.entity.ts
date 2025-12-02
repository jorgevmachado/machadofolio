import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { TMonth } from '@repo/services';

import { MonthEntity } from '@repo/business';

import { DecimalTransformer } from '../../transforms/decimal';

import { Expense } from './expense.entity';
import { Income } from './incomes.entity';


@Entity({ name: 'months' })
export class Month implements MonthEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false })
    paid!: boolean;

    @Column({ nullable: false })
    year!: number;

    @Column({ nullable: false })
    code!: number;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    value!: number;

    @Column({ nullable: false })
    label!: TMonth;

    @ManyToOne(() => Income, (income) => income.months, { nullable: true })
    income?: Income;

    @ManyToOne(() => Expense, (expense) => expense.months, { nullable: true })
    expense?: Expense;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ nullable: false })
    received_at?: Date;
}