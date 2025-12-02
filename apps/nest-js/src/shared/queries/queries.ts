import { isUUID } from '@repo/services';

import { Paginate, type PaginateParameters } from '@repo/business';

import { Query } from '../query';
import type { BasicEntity } from '../types';

import type { FindByParams, FindOneByOrder, FindOneByParams, ListParams } from './types';

import { NotFoundException } from '@nestjs/common';
import { type Repository } from 'typeorm';


export class Queries<T extends BasicEntity> {
    constructor(
        protected readonly alias: string,
        protected readonly relations: Array<string>,
        protected readonly repository: Repository<T>,
    ) {
    }

    async list(params: ListParams): Promise<Array<T> | PaginateParameters<T>> {
        const { page, limit } = params?.parameters ?? {};
        const query = new Query<T>({
            alias: this.alias,
            filters: params?.filters ?? [],
            relations: params?.relations ?? this.relations,
            defaultAsc: params?.defaultAsc,
            parameters: params?.parameters,
            repository: this.repository,
            withDeleted: params?.withDeleted,
            withRelations: params?.withRelations,
        }).initialize();

        if (!limit || !page) {
            return await query.getMany();
        }
        const currentPage = page <= 0 ? 1 : page;
        const [results, total] = await query
            .skip((currentPage - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return new Paginate(Number(page), Number(limit), Number(total), results);
    }

    async findBy({
                     filters = [],
                     relations = this.relations,
                     withThrow = true,
                     withDeleted,
                     searchParams,
                     withRelations,
                 }: FindByParams) {
        const query = new Query<T>({
            filters: filters,
            alias: this.alias,
            relations: relations,
            repository: this.repository,
            withDeleted: withDeleted,
            searchParams: searchParams,
            withRelations: withRelations,
        }).initialize();

        const result = await query.getOne();

        if (!result && withThrow) {
            throw new NotFoundException(`${this.alias} not found`);
        }

        return result;
    }

    async findOne(params: FindOneByParams) {
        const valueIsUUID = isUUID(params?.value);
        return await this.findBy({
            searchParams: {
                by: valueIsUUID ? 'id' : 'name',
                value: params?.value?.toLowerCase(),
                condition: valueIsUUID ? '=' : 'LIKE',
            },
            filters: params?.filters,
            relations: params?.relations,
            withThrow: params?.withThrow,
            withDeleted: params?.withDeleted,
            withRelations: params?.withRelations,
        });
    }

    async findOneByOrder<R>(params: FindOneByOrder<T, R>): Promise<T> {
        const {
            complete = true,
            withThrow = true,
        } = params
        const result = await this.findBy({
            searchParams: {
                by: 'order',
                value: params?.order,
            },
            withThrow,
        }) as T;

        if (!complete || !params?.completingData || !params?.response) {
            return result;
        }

        return params.completingData(result, params.response);
    }
}