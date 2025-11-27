import { Repository } from 'typeorm';

import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EMonth } from '@repo/services';

import { type IncomeEntity, type MonthEntity } from '@repo/business';

import { INCOME_MOCK, INCOME_MONTH_MOCK } from '../../mocks/income.mock';

import { Income } from '../entities/incomes.entity';
import { MonthService } from '../month/month.service';

import { type CreateIncomeDto } from './dto/create-income.dto';

import { IncomeSourceService } from './source/source.service';

import { IncomeService } from './income.service';

import { type UpdateIncomeDto } from './dto/update-income.dto';

jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn().mockImplementation((err) => { throw err; });
        seeder = {
            entities: jest.fn(),
            getRelation: jest.fn(),
            currentSeeds: jest.fn(),
        };
        findAll = jest.fn();
        findOne = jest.fn();
    }
    return { Service: ServiceMock }
});

describe('IncomeService', () => {
    let service: IncomeService;
    let repository: Repository<Income>;
    let sourceService: IncomeSourceService;
    let monthService: MonthService;

    const mockEntity = INCOME_MOCK as unknown as IncomeEntity
    const mockMonthEntity = INCOME_MONTH_MOCK as unknown as MonthEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IncomeService,
                { provide: getRepositoryToken(Income), useClass: Repository },
                {
                    provide: IncomeSourceService, useValue: {
                        seeds: jest.fn(),
                        findOne: jest.fn(),
                        createToSheet: jest.fn(),
                        treatEntityParam: jest.fn(),
                    }
                },
                {
                    provide: MonthService, useValue: {
                        persistList: jest.fn(),
                        removeList: jest.fn(),
                        business: {
                            generateMonthListUpdateParameters: jest.fn(),
                            generateMonthListCreationParameters: jest.fn()
                        }
                    }
                }
            ],
        }).compile();

        service = module.get<IncomeService>(IncomeService);
        repository = module.get<Repository<Income>>(getRepositoryToken(Income));
        sourceService = module.get<IncomeSourceService>(IncomeSourceService);
        monthService = module.get<MonthService>(MonthService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(sourceService).toBeDefined();
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('sourceService', () => {
        it('should return the source service instance', () => {
            const result = service.source;
            expect(result).toBe(sourceService);
        });
    });

    describe('create', () => {
        it('should create a new income and save it', async () => {
            const createDto: CreateIncomeDto = {
                year: mockEntity.year,
                name: mockEntity.name,
                total: mockEntity.total,
                source: mockEntity.source,
                received_at: mockEntity.created_at,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(service, 'existIncome' as any).mockResolvedValueOnce(undefined);

            jest.spyOn(monthService.business, 'generateMonthListCreationParameters').mockReturnValue([]);

            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            expect(await service.create(mockEntity.finance, createDto)).toEqual(mockEntity);
        });

        it('should update a income when exist and save it', async () => {
            const createDto: CreateIncomeDto = {
                year: mockEntity.year,
                name: mockEntity.name,
                total: mockEntity.total,
                source: mockEntity.source,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(service, 'existIncome' as any).mockResolvedValueOnce(mockEntity);

            jest.spyOn(monthService.business, 'generateMonthListCreationParameters').mockReturnValue([]);

            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            expect(await service.create(mockEntity.finance, createDto)).toEqual(mockEntity);
        });

        it('should create a new income and save it with month', async () => {
            const createDto: CreateIncomeDto = {
                year: mockEntity.year,
                name: mockEntity.name,
                total: mockEntity.total,
                month: EMonth.JANUARY,
                source: mockEntity.source,
                received_at: mockEntity.created_at,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(service, 'existIncome' as any).mockResolvedValueOnce(undefined);

            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            jest.spyOn(monthService.business, 'generateMonthListCreationParameters').mockReturnValue([mockMonthEntity]);
            jest.spyOn(monthService, 'persistList').mockResolvedValueOnce([{ ...mockMonthEntity, income: undefined, expense: undefined }]);

            jest.spyOn(service, 'save').mockResolvedValueOnce({ ...mockEntity, months: [mockMonthEntity] });

            const result = await service.create(mockEntity.finance, createDto) as Income

            expect(result.id).toEqual(mockEntity.id);
            expect(result.total).toEqual(mockMonthEntity.value);
            expect(result.months).toEqual([mockMonthEntity]);
        });

        it('should return error when try to save months', async () => {
            const createDto: CreateIncomeDto = {
                year: mockEntity.year,
                name: mockEntity.name,
                total: mockEntity.total,
                month: EMonth.JANUARY,
                source: mockEntity.source,
                received_at: mockEntity.created_at,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(service, 'existIncome' as any).mockResolvedValueOnce(undefined);

            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            jest.spyOn(monthService.business, 'generateMonthListCreationParameters').mockReturnValue([mockMonthEntity]);
            jest.spyOn(monthService, 'persistList').mockRejectedValueOnce(new ConflictException);

            await expect(service.create(mockEntity.finance, createDto)).rejects.toThrowError(ConflictException);
        });
    });

    describe('update', () => {
        it('should update a income name and save it', async () => {
            const updateDto: UpdateIncomeDto = {
                name: `${mockEntity.name}2`,
                description: 'description'
            };

            const expected: Income = {
                ...mockEntity,
                name: updateDto.name as string,
                description: updateDto.description as string,
            }

            jest.spyOn(service, 'findOne').mockResolvedValueOnce({...mockEntity, months: undefined });

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(monthService.business, 'generateMonthListUpdateParameters').mockReturnValue([]);

            jest
                .spyOn(service, 'save')
                .mockResolvedValueOnce(expected);

            expect(
                await service.update(mockEntity.finance, mockEntity.id, updateDto)
            ).toEqual(
                expected,
            );
        });

        it('should update a income months and save it', async () => {
            const month = {
                ...mockMonthEntity,
                paid: true,
                value: 1000,
            }
            const updateDto: UpdateIncomeDto = {
                year: 2025,
                source: mockEntity.source.name,
                months: [month]
            };

            const expected: Income = {
                ...mockEntity,
                year: 2025,
                months: [month]
            }

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(monthService.business, 'generateMonthListUpdateParameters').mockReturnValue([month]);

            jest.spyOn(monthService, 'persistList').mockResolvedValueOnce([{...month, income: undefined, expense: undefined }]);

            jest
                .spyOn(service, 'save')
                .mockResolvedValueOnce(expected);

            expect(
                await service.update(mockEntity.finance, mockEntity.id, updateDto)
            ).toEqual(
                expected,
            );
        });

        it('should return error when try to update months', async () => {
            const month = {
                ...mockMonthEntity,
                paid: true,
                value: 1000,
            }
            const updateDto: UpdateIncomeDto = {
                year: 2025,
                source: mockEntity.source.name,
                months: [month]
            };


            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest.spyOn(monthService.business, 'generateMonthListUpdateParameters').mockReturnValue([month]);

            jest.spyOn(monthService, 'persistList').mockRejectedValueOnce(new ConflictException);

            await expect(
                service.update(mockEntity.finance, mockEntity.id, updateDto)
            ).rejects.toThrowError(ConflictException);
        });
    });

    describe('remove', () => {
        it('should remove a income without months', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce({...mockEntity, months: undefined });
            jest.spyOn(monthService, 'removeList').mockResolvedValueOnce({ message: 'No months found in income to remove'});
            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce(mockEntity);
            const result = await service.remove(mockEntity.id);
            expect(result).toEqual({ message: 'Successfully removed' });
        });

        it('should remove a income with months', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
            jest.spyOn(monthService, 'removeList').mockResolvedValueOnce({ message: 'All Months by income Successfully removed'});
            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce(mockEntity);
            const result = await service.remove(mockEntity.id);
            expect(result).toEqual({ message: 'Successfully removed' });
        });
    });

    describe('seeds', () => {
        it('should seed', async () => {
            jest.spyOn(sourceService, 'seeds').mockResolvedValueOnce([mockEntity.source]);

            jest.spyOn(service.seeder, 'getRelation').mockReturnValueOnce(mockEntity.source);


            jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
                createdEntityFn(mockEntity);
                return [mockEntity];
            });

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([{ ...mockEntity, months: [mockMonthEntity] }]);

            jest.spyOn(monthService, 'persistList').mockResolvedValueOnce([{ ...mockMonthEntity, income: undefined, expense: undefined }]);

            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            expect(await service.seeds({
                finance: mockEntity.finance,
                incomeListJson: [mockEntity],
                incomeSourceListJson: [mockEntity.source],
            })).toEqual({
                incomeList: [mockEntity],
                incomeSourceList: [mockEntity.source]
            });
        });

        it('should seed without months', async () => {
            jest.spyOn(sourceService, 'seeds').mockResolvedValueOnce([mockEntity.source]);

            jest.spyOn(service.seeder, 'getRelation').mockReturnValueOnce(mockEntity.source);


            jest.spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
                createdEntityFn(mockEntity);
                return [mockEntity];
            });

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValueOnce([]);

            expect(await service.seeds({
                finance: mockEntity.finance,
                incomeListJson: [mockEntity],
                incomeSourceListJson: [mockEntity.source],
            })).toEqual({
                incomeList: [mockEntity],
                incomeSourceList: [mockEntity.source]
            });
        });
    });

    describe('createToSheet', () => {
        it('should create income when not found in database', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(sourceService, 'createToSheet').mockResolvedValueOnce(mockEntity.source);
            jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);
            expect(await service.createToSheet(mockEntity.finance, mockEntity)).toEqual(mockEntity);
        });


        it('should create income when not found in database with some params empty', async () => {
            const expected = {
                ...mockEntity,
                source: {
                    ...mockEntity,
                    name: 'Unknown'
                },
                received_at: new Date(),
            }
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(sourceService, 'createToSheet').mockResolvedValueOnce(expected.source);
            jest.spyOn(service, 'create').mockResolvedValueOnce(expected);
            expect(await service.createToSheet(mockEntity.finance, {
                ...mockEntity,
                name: undefined,
                source: undefined,
                received_at: undefined
            } as any)).toEqual(expected);
        });

        it('should return when income exist in database', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
            expect(await service.createToSheet(mockEntity.finance, mockEntity)).toEqual(mockEntity);
        })
    });

    describe('privates', () => {
        describe('existIncome', () => {
            it('should return undefined when dont exist income created', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
                const result = await service['existIncome'](mockEntity.finance, mockEntity.name, mockEntity.year);
                expect(result).toBeUndefined();
            });
            it('should return income when exist income created', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockEntity]);
                const result = await service['existIncome'](mockEntity.finance,mockEntity.name, mockEntity.year);
                expect(result).toEqual(mockEntity);
            });
        });
    });
});