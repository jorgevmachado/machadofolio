import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group as GroupConstructor } from '@repo/business';

import GROUP_LIST_DEVELOPMENT_JSON from '../../../seeds/development/finance/groups.json';
import GROUP_LIST_STAGING_JSON from '../../../seeds/staging/finance/groups.json';
import GROUP_LIST_PRODUCTION_JSON from '../../../seeds/production/finance/groups.json';

import { GenerateSeeds, ListParams, Service } from '../../shared';

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

    async generateSeeds(financeSeedsDir: string): Promise<GenerateSeeds<Group>> {
        const groups = await this.findAll({ withDeleted: true }) as Array<Group>;
        const listJson = this.getListJson<Group>({
            staging: GROUP_LIST_STAGING_JSON,
            production: GROUP_LIST_PRODUCTION_JSON,
            development: GROUP_LIST_DEVELOPMENT_JSON,
        });
        const added = groups.filter((item) => !listJson.find((json) => json.id === item.id || json.name === item.name || json.name_code === item.name_code));
        const list = [...listJson, ...added];
        if(added.length > 0) {
            this.file.writeFile('groups.json', financeSeedsDir, list);
        }
        return {
            list,
            added
        }
    }
}
