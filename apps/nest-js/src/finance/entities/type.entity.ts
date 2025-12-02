import type { SupplierTypeEntity } from '@repo/business';

import { Supplier } from './supplier.entity';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'supplier_types' })
export class SupplierType implements SupplierTypeEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, unique: true, length: 200 })
    name!: string;

    @Column({ nullable: false, unique: true, length: 200 })
    name_code!: string;

    @OneToMany(() => Supplier, (supplier) => supplier.type)
    @JoinTable()
    suppliers?: Array<Supplier>;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}