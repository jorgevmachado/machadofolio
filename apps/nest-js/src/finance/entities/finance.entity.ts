import { FinanceEntity } from '@repo/business';

import { User } from '../../auth/entities/user.entity';

import { Bill } from './bill.entity';
import { Group } from './group.entity';
import { Income } from './incomes.entity';

import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'finances' })
export class Finance implements FinanceEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User, (user) => user.finance)
    user!: User;

    @OneToMany(() => Bill, (bill) => bill.finance)
    @JoinTable()
    bills?: Array<Bill>;

    @OneToMany(() => Group, (group) => group.finance)
    @JoinTable()
    groups?: Array<Group>;

    @OneToMany(() => Income, (income) => income.source)
    incomes?: Array<Income>;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

}
