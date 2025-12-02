import type { BankEntity } from '@repo/business';

import { Bill } from './bill.entity';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'banks' })
export class Bank implements BankEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: BankEntity['id'];

    @Column({ nullable: false, unique: true, length: 200 })
    name!: string;

    @OneToMany(() => Bill, (bill) => bill.bank)
    @JoinTable()
    bills?: Array<Bill>;

    @Column({ nullable: false, unique: true, length: 200 })
    name_code!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}