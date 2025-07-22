import { ConflictException } from '@nestjs/common';
import { type Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services';

import type { BasicEntity } from '../types';
import { Queries } from '../queries';
import { Validate } from '../validate';

import type { CurrentSeedsParams, ExecuteSeedParams, GetRelationParams, SeedEntitiesParams, SeedEntityParams } from './types';


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

    async entities({
                       by,
                       key,
                       seeds,
                       label,
                       seedsJson,
                       withReturnSeed = true,
                       createdEntityFn,
                   }: SeedEntitiesParams<T>) {
        const list = this.currentSeeds<T>({ seeds, seedsJson });
        this.validate.listMock<T>({ key, list, label });
        console.info(`# => Start ${label.toLowerCase()} seeding`);
        const existingEntities = await this.repository.find({ withDeleted: true, relations: this.relations });
        const existingEntitiesBy = new Set(
            existingEntities.map((entity) => entity[by]),
        );

        const entitiesToCreate = list.filter(
            (entity) => !existingEntitiesBy.has(entity[by]),
        );

        if (entitiesToCreate.length === 0) {
            console.info(`# => No new ${label.toLowerCase()} to seed`);
            return existingEntities;
        }
        const createdEntities = (
            await Promise.all(
                entitiesToCreate.map(async (entity) => {
                    const newEntity = await createdEntityFn(entity);
                    if(!newEntity) {
                        return ;
                    }
                    return this.repository
                        .save(newEntity)
                        .then((entity) => entity)
                        .catch();
                }),
            )
        ).filter((entity) => !!entity);
        console.info(
            `# => Seeded ${createdEntities.length} new ${label.toLowerCase()}`,
        );
        const seed = [...existingEntities, ...createdEntities];
        if (!withReturnSeed) {
            return { message: `Seeding ${label} Completed Successfully!` };
        }
        return seed;
    }

    async entity({ by, label, seed, withReturnSeed = true, createdEntityFn }: SeedEntityParams<T>) {
        console.info(`# => Start ${label.toLowerCase()} seeding`);
        const messageResult = { message: `Seeding ${label} Completed Successfully!` };
        const currentSeed = await this.queries.findOne({
            value: seed[by] ?? '',
            withThrow: false,
        });
        if (currentSeed) {
            console.info(`# => No new ${label.toLowerCase()} to seed`);
            return withReturnSeed ? currentSeed : messageResult;
        }
        const entity = await createdEntityFn(seed as T);
        return withReturnSeed ? entity : messageResult;
    }

    async executeSeed<T>({
                             label,
                             seedMethod,
                         }: ExecuteSeedParams<T>): Promise<Array<T>> {
        console.info(`# => Seeding ${label}`);
        const items = await seedMethod();
        const validItems = this.filterValidItems<T>(items);
        console.info(`# => ${validItems.length} ${label} seeded successfully`);
        return validItems;
    }

    filterValidItems<T>(items: Array<T | void>): Array<T> {
        return items.filter((item): item is T => item !== undefined);
    }

    getRelation<T extends { id: string; name?: string }>({
                                                             key,
                                                             list,
                                                             param,
                                                             relation,
                                                         }: GetRelationParams<T>) {
        const item = list?.find((item) => item[key] === param);
        if (!item) {
            throw new ConflictException(
                `The selected ${relation} does not exist, try another one or create one.`,
            );
        }
        return item;
    }

    currentSeeds<T>({ seeds, seedsJson }: CurrentSeedsParams<T> ) {
        if(!seeds && !seedsJson) {
            return [];
        }

        const currentSeeds = seeds ?? [];
        const currentSeedsJson = seedsJson ?
            seedsJson.map((item) => transformObjectDateAndNulls<T, unknown>(item))
            : seedsJson;

        return currentSeedsJson ?? currentSeeds;
    }
}