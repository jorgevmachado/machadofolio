import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group as GroupConstructor } from '@repo/business';

import { ListParams, Service } from '../../shared';

import { Finance } from '../entities/finance.entity';
import type { FinanceSeederParams } from '../types';
import { Group } from '../entities/group.entity';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

type GroupSeederParams = FinanceSeederParams & {
    finances: Array<Finance>;
}

@Injectable()
export class GroupService extends Service<Group> {
    constructor(
        @InjectRepository(Group)
        protected repository: Repository<Group>,
    ) {
        super('groups', ['finance'], repository);
    }

    async create(finance: Finance, { name }: CreateGroupDto) {
        const billGroup = new GroupConstructor({ name, finance });
        return await this.save(billGroup);
    }

    async update(finance: Finance, param: string, { name }: UpdateGroupDto) {
        const result = await this.findOne({ value: param, withDeleted: true });
        const billGroup = new GroupConstructor({ ...result, name, finance });
        return await this.save(billGroup);
    }

    async remove(param: string, filters?: ListParams['filters']) {
        const result = await this.findOne({
            value: param,
            filters,
            relations: ['bills'],
            withDeleted: true,
        }) as Group;

        if (result?.bills?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete the group because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async seeds({ finances, groupListJson: seedsJson }: GroupSeederParams) {
        return this.seeder.entities({
            by: 'id',
            key: 'all',
            label: 'Group',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (entity) => {
                const finance = finances.find((item) => item.id === entity.finance.id);
                if(!finance) {
                    return;
                }
                return new GroupConstructor({
                    ...entity,
                    finance
                })
            }
        });
    }

    async createToSheet(finance: Finance, value: string) {
        const item = await this.findOne({ value, withDeleted: true, withThrow: false });

        if(item) {
            return item;
        }

        return this.create(finance, { name: value });
    }
}
