import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { IncomeEntity } from '@repo/business';

import { Finance } from './finance.entity';
import { IncomeSource } from './income-source.entity';
import { DecimalTransformer } from '../../transforms/decimal';

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

    @ManyToOne(() => IncomeSource, (source) => source.incomes, { nullable: false })
    source!: IncomeSource;

    @ManyToOne(() => Finance, (finance) => finance.incomes, { nullable: false })
    finance!: Finance;

    @Column({ nullable: false, length: 200 })
    name_code!: string;

    @Column({ nullable: false })
    received_at!: Date;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}