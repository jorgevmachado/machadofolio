import { findRepeated } from '@repo/services';

import { type BasicEntity } from '../types';

import { type ValidateListMockParams } from './types';

import { ConflictException } from '@nestjs/common';

export class Validate {

    param<T>(value?: string | T, label?: string) {
        if (!value) {
            throw new ConflictException(
                `The selected ${label ?? 'field'} does not exist, try another one or create one.`,
            );
        }
    }

    paramIsEntity<T>(value: any): value is T {
        return value !== null && value !== undefined && typeof value === 'object' && 'id' in value;
    }

    mock(key: 'id' | 'name', label: string, param?: string) {
        if (!param) {
            return;
        }
        console.error(`# => validate  list mock ${label}  failed!!`);
        throw new ConflictException(
            `The selected ${key} ${param} is repeated in ${label}, try another one or update this.`,
        );
    }

    listMock<T extends BasicEntity>({ key, list, label }: ValidateListMockParams<T>) {
        console.info(`# => start validate list mock ${label}`);
        const findRepeatedEntityById = key === 'id' || key === 'all'
            ? findRepeated<T>(list, 'id')
            : undefined;
        this.mock('id', label, findRepeatedEntityById);

        console.info(`# => validate list mock ${label} by id is passed!!`);
        const findRepeatedEntityByName = key === 'name' || key === 'all'
                ? findRepeated<T>(list, 'name')
                : undefined;
        this.mock('name', label, findRepeatedEntityByName);
        console.info(`# => validate list mock ${label} by name is passed!!`);
    }
}