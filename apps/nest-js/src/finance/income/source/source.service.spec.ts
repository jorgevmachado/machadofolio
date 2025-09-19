import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

jest.mock('../../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn();
        seeder = {
            entities: jest.fn(),
        };
        findOne = jest.fn();
    }
    return { Service: ServiceMock }
});
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { INCOME_SOURCE_MOCK } from '../../../mocks/income-source.mock';
import { INCOME_MOCK } from '../../../mocks/income.mock';

import { IncomeSource } from '../../entities/income-source.entity';
import { Income } from '../../entities/incomes.entity';

import { IncomeSourceService } from './source.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

describe('SourceService', () => {
  let service: IncomeSourceService;
  let repository: Repository<IncomeSource>;

  const mockEntity: IncomeSource = INCOME_SOURCE_MOCK as unknown as IncomeSource;
  const mockIncomeEntity: Income = INCOME_MOCK as unknown as Income;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          IncomeSourceService,
          { provide: getRepositoryToken(IncomeSource), useClass: Repository }
      ],
    }).compile();

    service = module.get<IncomeSourceService>(IncomeSourceService);
    repository = module.get<Repository<IncomeSource>>(getRepositoryToken(IncomeSource));
  });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a new incomeSource and save it', async () => {
            const createDto: CreateSourceDto = {
                name: mockEntity.name,
            };

            jest
                .spyOn(repository, 'save')
                .mockResolvedValueOnce(mockEntity);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            expect(await service.create(createDto)).toEqual(
                mockEntity,
            );
        });
    });

    describe('update', () => {
        it('should update a incomeSource and save it', async () => {
            const updateDto: UpdateSourceDto = {
                name: `${mockEntity.name}2`,
            };

            const expected: IncomeSource = {
                ...mockEntity,
                ...updateDto,
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

            expect(
                await service.update(mockEntity.id, updateDto),
            ).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should remove incomeSource when there are no associated incomes', async () => {
            const expected: IncomeSource = {
                ...mockEntity,
                incomes: [],
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(expected);

            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce({
                ...expected,
                deleted_at: mockEntity.created_at,
            });

            expect(await service.remove(mockEntity.id)).toEqual({
                message: 'Successfully removed',
            });
        });

        it('should throw a ConflictException when incomeSource is in use', async () => {
            const expected: IncomeSource = {
                ...mockEntity,
                incomes: [{
                    id: mockIncomeEntity.id,
                    year: mockIncomeEntity.year,
                    name: mockIncomeEntity.name,
                    total: mockIncomeEntity.total,
                    source: mockEntity,
                    finance: mockIncomeEntity.finance,
                    name_code: mockIncomeEntity.name_code,
                    received_at: mockIncomeEntity.received_at,
                    created_at: mockIncomeEntity.created_at,
                    updated_at: mockIncomeEntity.updated_at
                }],
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(expected);
            jest.spyOn(service, 'error').mockImplementationOnce(() => { throw new ConflictException(); });

            await expect(
                service.remove(mockEntity.id),
            ).rejects.toThrowError(ConflictException);
        });
    });

    describe('seeds', () => {
        it('should seed incomeSource.', async () => {
            jest.spyOn(service.seeder, 'entities').mockImplementation( async ({ createdEntityFn }: any) => {
                createdEntityFn(mockEntity);
                return [mockEntity];
            });

            expect(await service.seeds({ incomeSourceListJson: [mockEntity] })).toEqual([mockEntity]);
        });
    });

    describe('createToSheet', () => {
        it('should return NotFoundException when value is undefined.', async () => {
            await expect(service.createToSheet(undefined)).rejects.toThrowError(NotFoundException);
        });

        it('should return NotFoundException when value is "".', async () => {
            await expect(service.createToSheet('')).rejects.toThrowError(NotFoundException);
        });

        it('should return when incomeSource exist in database.', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
            expect(await service.createToSheet(mockEntity.name)).toEqual(mockEntity);
        });

        it('should return when incomeSource not exist in database.', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);
            expect(await service.createToSheet(mockEntity.name)).toEqual(mockEntity);
        })
    });
});
