import { EExpenseType, type ExpenseEntity } from '@repo/business';

import { DecimalTransformer } from '../../transforms/decimal';

import { Bill } from './bill.entity';
import { Month } from './month.entity';
import { Supplier } from './supplier.entity';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'expenses' })
export class Expense implements ExpenseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, length: 200 })
    name!: string;

    @Column({ nullable: false })
    year!: number;

    @ManyToOne(() => Bill, (bill) => bill.expenses, {
        nullable: false,
    })
    @JoinTable()
    bill!: Bill;

    @Column({
        nullable: false,
        type: 'enum',
        enum: EExpenseType,
    })
    type!: EExpenseType;

    @Column({ nullable: false })
    paid!: boolean;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    total!: number;

    @ManyToOne(() => Supplier, (supplier) => supplier.expenses, {
        nullable: false,
    })
    @JoinTable()
    supplier!: Supplier;

    @Column({ nullable: false, length: 200 })
    name_code!: string;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    total_paid!: number;

    @Column({
        nullable: true,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    total_pending?: number;

    @OneToMany(() => Month, (expenseMonth) => expenseMonth.expense)
    months?: Array<Month>;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: false })
    instalment_number!: number;

    @ManyToOne(() => Expense, (expense) => expense.children, { nullable: true })
    @JoinTable()
    parent?: Expense;

    @OneToMany(() => Expense, (expense) => expense.parent)
    children?: Array<Expense>;

    @Column({ default: false })
    is_aggregate?: boolean;

    @Column({ nullable: true })
    aggregate_name?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
