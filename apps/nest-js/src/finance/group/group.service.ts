import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import GroupConstructor from '@repo/business/finance/group/group';

import { Service } from '../../shared';

import type { FinanceSeederParams } from '../types';

import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from '../entities/group.entity';
import { UpdateGroupDto } from './dto/update-group.dto';


@Injectable()
export class GroupService extends Service<Group> {
    constructor(
        @InjectRepository(Group)
        protected repository: Repository<Group>,
    ) {
        super('groups', [], repository);
    }

    async create({ name }: CreateGroupDto) {
        const billGroup = new GroupConstructor({ name });
        return await this.save(billGroup);
    }

    async update(param: string, { name }: UpdateGroupDto) {
        const result = await this.findOne({ value: param, withDeleted: true });
        const billGroup = new GroupConstructor({ ...result, name });
        return await this.save(billGroup);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
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

    async seeds({
                    withReturnSeed = true,
                    groupListJson: listJson,
                }: FinanceSeederParams) {
        if (!listJson) {
            return [];
        }
        const seeds = listJson.map((item) =>
            transformObjectDateAndNulls<Group, unknown>(item)
        )
        return this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Group',
            seeds,
            withReturnSeed,
            createdEntityFn: async (item) => item,
        });
    }
}
