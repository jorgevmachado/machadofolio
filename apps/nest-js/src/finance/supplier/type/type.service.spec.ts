import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SUPPLIER_TYPE_MOCK } from '../../mocks/supplier-type.mock';
import { SupplierType } from '../../entities/type.entity';

import { type CreateTypeDto } from './dto/create-type.dto';
import { SupplierTypeService } from './type.service';
import { type UpdateTypeDto } from './dto/update-type.dto';


describe('TypeService', () => {
    let service: SupplierTypeService;
    let repository: Repository<SupplierType>;

    const mockEntity: SupplierType = SUPPLIER_TYPE_MOCK

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupplierTypeService,
                { provide: getRepositoryToken(SupplierType), useClass: Repository },
            ],
        }).compile();

        service = module.get<SupplierTypeService>(SupplierTypeService);
        repository = module.get<Repository<SupplierType>>(
            getRepositoryToken(SupplierType),
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a new supplierType and save it', async () => {
            const createDto: CreateTypeDto = {
                name: mockEntity.name,
            };

            jest
                .spyOn(repository, 'save')
                .mockResolvedValueOnce(mockEntity);

            expect(await service.create(createDto)).toEqual(
                mockEntity,
            );
        });
    });

    describe('update', () => {
        it('should update a supplierType and save it', async () => {
            const updateDto: UpdateTypeDto = {
                name: `${mockEntity.name}2`,
            };

            const expected: SupplierType = {
                ...mockEntity,
                ...updateDto,
            };

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(mockEntity),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(expected);

            expect(
                await service.update(mockEntity.id, updateDto),
            ).toEqual(expected);
        });
    });
});
