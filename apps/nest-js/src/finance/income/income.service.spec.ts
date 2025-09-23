import { ConflictException } from '@nestjs/common';

jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn().mockImplementationOnce(() => { throw new ConflictException(); });
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

import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { IncomeEntity, MonthEntity } from '@repo/business';

import { INCOME_MOCK, INCOME_MONTH_MOCK } from '../../mocks/income.mock';

import { Income } from '../entities/incomes.entity';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeSourceService } from './source/source.service';
import { IncomeService } from './income.service';
import { MonthService } from '../month/month.service';

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
                        createByRelationship: jest.fn(),
                        updateByRelationship: jest.fn(),
                        removeByIncome: jest.fn(),
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

            jest.spyOn(monthService, 'createByRelationship').mockReturnValue(mockEntity.months as any);

            jest
                .spyOn(service, 'saveCreateIncome' as any)
                .mockResolvedValueOnce(mockEntity);

            expect(await service.create(mockEntity.finance, createDto)).toEqual(
                mockEntity,
            );
        });

        it('should create a new income with income source string and save it', async () => {
            const createDto: CreateIncomeDto = {
                year: mockEntity.year,
                name: mockEntity.name,
                total: mockEntity.total,
                source: mockEntity.source.name,
                received_at: mockEntity.created_at,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest
                .spyOn(service, 'saveCreateIncome' as any)
                .mockResolvedValueOnce(mockEntity);

            expect(await service.create(mockEntity.finance, createDto)).toEqual(
                mockEntity,
            );
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

            jest.spyOn(monthService, 'updateByRelationship').mockResolvedValueOnce(expected.months as any);

            jest
                .spyOn(service, 'save')
                .mockResolvedValueOnce(expected);

            expect(
                await service.update(mockEntity.finance, mockEntity.id, updateDto)
            ).toEqual(
                expected,
            );
        });
    });

    describe('remove', () => {
        it('should remove a income without months', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce({...mockEntity, months: undefined });
            jest.spyOn(repository, 'softRemove').mockResolvedValueOnce(mockEntity);
            const result = await service.remove(mockEntity.id);
            expect(result).toEqual({ message: 'Successfully removed' });
        });

        it('should remove a income with months', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
            jest.spyOn(monthService, 'removeByIncome').mockResolvedValueOnce(mockEntity.months as any);
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
        describe('existIncomeCreated', () => {
            it('should return undefined when dont exist income created', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
                const result = await service['existIncomeCreated'](mockEntity.name, mockEntity.year);
                expect(result).toBeUndefined();
            });
            it('should return income when exist income created', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockEntity]);
                const result = await service['existIncomeCreated'](mockEntity.name, mockEntity.year);
                expect(result).toEqual(mockEntity);
            });
        });

        describe('saveCreateIncome', () => {
            const params = {
                value: 100,
                month: 'JANUARY',
                income: mockEntity,
                received_at: mockEntity.created_at,
            }
            it('should throw error when persist income return error', async () => {
                await expect(service['saveCreateIncome'](params as any)).rejects.toThrowError(ConflictException);
            });

            it('should persist income when not exist income created', async () => {
                jest.spyOn(service, 'existIncomeCreated' as any).mockReturnValueOnce(null);
                jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
                jest.spyOn(monthService, 'createByRelationship').mockResolvedValueOnce(mockEntity.months as any);
                jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
                const result = await service['saveCreateIncome'](params as any);
                expect(result).toEqual(mockEntity);
            });

            it('should persist income when exist income created', async () => {
                jest.spyOn(service, 'existIncomeCreated' as any).mockReturnValueOnce(mockEntity);
                jest.spyOn(monthService, 'createByRelationship').mockResolvedValueOnce([mockEntity.months] as any);
                jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
                const result = await service['saveCreateIncome'](params as any);
                expect(result).toEqual(mockEntity);
            });
        });
    });
});
