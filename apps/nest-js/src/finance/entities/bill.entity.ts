import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { type BillEntity, EBillType } from '@repo/business';

import { DecimalTransformer } from '../../transforms/decimal';

import { Bank } from './bank.entity';
import { Expense } from './expense.entity';
import { Finance } from './finance.entity';
import { Group } from './group.entity';

@Entity({ name: 'bills' })
export class Bill implements BillEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @Column({ nullable: false, length: 200 })
    name!: string;
    
    @Column({ nullable: false })
    year!: number;
    @Column({
        nullable: false,
        type: 'enum',
        enum: EBillType,
    })
    type!: EBillType;

    @ManyToOne(() => Bank, (bank) => bank.bills, {
        nullable: false,
    })
    @JoinTable()
    bank!: Bank;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    total!: number;
    
    @ManyToOne(() => Finance, (finance) => finance.bills, {
        nullable: false,
    })
    @JoinTable()
    finance!: Finance;

    @ManyToOne(() => Group, (group) => group.bills, {
        nullable: false,
    })
    @JoinTable()
    group!: Group;

    @OneToMany(() => Expense, (expense) => expense.bill, { nullable: true })
    @JoinTable()
    expenses?: Array<Expense>;

    @Column({ nullable: false, default: false })
    all_paid!: boolean;

    @Column({ nullable: false, length: 200 })
    name_code!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({
        nullable: false,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
        transformer: new DecimalTransformer(),
    })
    total_paid!: number;
}
