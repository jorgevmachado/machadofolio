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

import type { GroupEntity } from '@repo/business/finance/group/types';

import { Bill } from './bill.entity';

@Entity({ name: 'groups' })
export class Group implements GroupEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, unique: true, length: 200 })
    name!: string;

    @OneToMany(() => Bill, (bill) => bill.group)
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
