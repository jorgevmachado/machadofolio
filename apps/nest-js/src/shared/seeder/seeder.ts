import { type Repository } from 'typeorm';

import type { BasicEntity } from '../types';
import { Queries } from '../queries';
import { Validate } from '../validate';

export class Seeder<T extends BasicEntity> {
    private validate: Validate;
    private readonly queries: Queries<T>;
    constructor(
        protected readonly alias: string,
        protected readonly relations: Array<string>,
        protected readonly repository: Repository<T>,
    ) {
        this.validate = new Validate();
        this.queries = new Queries<T>(alias, relations, repository);
    }
}