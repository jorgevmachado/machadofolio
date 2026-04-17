import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import type { GroupEntity } from '@repo/business';

import { Bill } from './bill.entity';
import { Finance } from './finance.entity';

@Entity({ name: 'groups' })
export class Group implements GroupEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, unique: true, length: 200 })
    name!: string;

    @OneToMany(() => Bill, (bill) => bill.group)
    @JoinTable()
    bills?: Array<Bill>;

    @ManyToOne(() => Finance, (finance) => finance.groups, {
        nullable: false,
    })
    @JoinTable()
    finance!: Finance;

    @Column({ nullable: false, unique: true, length: 200 })
    name_code!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
