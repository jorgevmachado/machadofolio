import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { GROUP_MOCK } from '../mock';
import Group from './group';
import type { GroupConstructorParams, GroupEntity } from './types';

describe('Group', () => {
    const mockEntity = GROUP_MOCK as unknown as GroupEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            const params: GroupConstructorParams = mockEntity;

            const group = new Group(params);

            expect(group.id).toBe(params.id);
            expect(group.name).toBe(params.name);
            expect(group.created_at).toEqual(params.created_at);
            expect(group.updated_at).toEqual(params.updated_at);
            expect(group.deleted_at).toBeUndefined();
        });

        it('should create an instance with minimal valid data', () => {
            const params: GroupConstructorParams = {
                name: 'Bill B',
                finance: mockEntity.finance
            };

            const group = new Group(params);

            expect(group.id).toBeUndefined();
            expect(group.name).toBe(params.name);
            expect(group.created_at).toBeUndefined();
            expect(group.updated_at).toBeUndefined();
            expect(group.deleted_at).toBeUndefined();
        });

        it('should allow instantiation with no parameters', () => {
            const group = new Group();

            expect(group.id).toBeUndefined();
            expect(group.name).toBeUndefined();
            expect(group.created_at).toBeUndefined();
            expect(group.updated_at).toBeUndefined();
            expect(group.deleted_at).toBeUndefined();
        });
    });
});