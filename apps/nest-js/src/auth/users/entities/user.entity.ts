import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { EGender } from "@repo/services/personal-data/enum";

import { ERole, EStatus } from "@repo/business/enum";
import { UserEntity } from '@repo/business/auth/types';

@Entity({ name: 'users' })
export class User implements UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, unique: true, length: 11 })
    cpf!: string;

    @Column({ nullable: false, type: 'enum', enum: ERole, default: ERole.USER })
    role!: ERole;

    @Column({ nullable: false })
    salt?: string;

    @Column({ nullable: false, length: 200 })
    name!: string;

    @Column({ nullable: false, unique: true, length: 200 })
    email!: string;

    @Column({ nullable: false })
    gender!: EGender;

    @Column({
        nullable: false,
        type: 'enum',
        enum: EStatus,
        default: EStatus.INCOMPLETE,
    })
    status!: EStatus;

    @Column({ nullable: false, unique: true, length: 11 })
    whatsapp!: string;

    @Column({ nullable: true })
    picture?: string;

    @Column({ nullable: false })
    password?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({ nullable: false })
    date_of_birth!: Date;

    @Column({ nullable: true, length: 64 })
    recover_token?: string;

    @Column({ nullable: true, length: 64 })
    confirmation_token?: string;
}
