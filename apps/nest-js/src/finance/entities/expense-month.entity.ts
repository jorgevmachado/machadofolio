import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { ExpenseMonthEntity } from '@repo/business';

import { DecimalTransformer } from '../../transforms/decimal';

import { Expense } from './expense.entity';

@Entity({ name: 'expense_months' })
export class ExpenseMonth implements ExpenseMonthEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false })
    paid!: boolean;

    @Column({ nullable: false })
    year!: number;

    @Column({ nullable: false })
    month!: number;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    value!: number;

    @ManyToOne(() => Expense, (expense) => expense.months, { nullable: false })
    expense!: Expense;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}