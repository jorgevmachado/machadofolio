import { type Repository } from 'typeorm';

import { isUUID } from '@repo/services/UUID/UUID';

import type { PaginateParameters } from '@repo/business/paginate/types';

import type { BasicEntity } from '../types';

import { type FindOneByParams, type ListParams, Queries } from '../queries';
import { Base } from '../base';
import { File } from '../file';
import { Seeder } from '../seeder';
import { Validate } from '../validate';



export abstract class Service<T extends BasicEntity> extends Base {
    private readonly fileModule!: File;
    private readonly seederModule!: Seeder<T>;
    private readonly queriesModule!: Queries<T>;
    private readonly validateModule!: Validate;

    protected constructor(
        protected readonly alias: string,
        protected readonly relations: Array<string>,
        protected readonly repository: Repository<T>,
    ) {
        super();
        this.fileModule = new File();
        this.seederModule = new Seeder<T>(alias, relations, repository);
        this.queriesModule = new Queries<T>(alias, relations, repository);
        this.validateModule = new Validate();
    }

    get file(): File {
        return this.fileModule;
    }

    get seeder(): Seeder<T> {
        return this.seederModule;
    }

    get validate(): Validate {
        return this.validateModule;
    }

    get queries(): Queries<T> {
        return this.queriesModule;
    }

    async save(data: T): Promise<void | T> {
        const currentData = {
            ...data,
            id: data.id === '' ? undefined : data.id,
        }
        return this.repository.save(currentData)
            .then()
            .catch((error) => {
                throw this.error(error)}
            );
    }

    async softRemove(data: T): Promise<void | T> {
        return this.repository
            .softRemove(data)
            .then()
            .catch((error) => {
                throw this.error(error);
            });
    }

    async findAll(listParams: ListParams): Promise<Array<T> | PaginateParameters<T>> {
        return await this.queries.list(listParams);
    }

    async findOne(findOneByParams: FindOneByParams) {
        return await this.queries.findOne(findOneByParams);
    }

    async remove(param: string, filters: ListParams['filters'] = [], withDeleted: boolean = false) {
        const result = await this.queries.findOne({
            value: param,
            filters,
            relations: this.relations,
            withDeleted,
        });
        if(result) {
            await this.repository.softRemove(result);
        }
        return { message: 'Successfully removed' };
    }


    async treatEntityParam<T>(value?: string | T, label?: string, list?: Array<T>) {
        this.validate.param<T>(value, label);
        if (!value || this.validate.paramIsEntity<T>(value)) {
            return value;
        }
        const entity = !list
            ? await this.queries.findOne({ value, withThrow: false, withRelations: true })
            : this.findOneByList<T>(value, list);
        this.validate.param<T>(entity as unknown as string | T, label);
        return entity;
    }


    async treatEntitiesParams<T>(values?: Array<string | T>, label?: string) {
        if (!values || values.length === 0) {
            return [];
        }
        return Promise.all(
            values?.map(
                async (value) => await this.treatEntityParam<T>(value, label),
            ),
        );
    }

    findOneByList<T>(value: string, list: Array<T>) {
        const valueIsUUID = isUUID(value);
        const key = valueIsUUID ? 'id' : 'name';
        return list.find((item) => item[key] === value);
    }
}