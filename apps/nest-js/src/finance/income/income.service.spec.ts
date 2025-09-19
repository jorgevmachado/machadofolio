import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn();
        seeder = {
            entities: jest.fn(),
            getRelation: jest.fn(),
        };
        findOne = jest.fn();
    }
    return { Service: ServiceMock }
});
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { IncomeEntity } from '@repo/business';

import { INCOME_MOCK } from '../../mocks/income.mock';

import { Income } from '../entities/incomes.entity';

import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeSourceService } from './source/source.service';

describe('IncomeService', () => {
  let service: IncomeService;
  let repository: Repository<Income>;
  let sourceService: IncomeSourceService;

  const mockEntity = INCOME_MOCK as unknown as IncomeEntity

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          IncomeService,
          { provide: getRepositoryToken(Income), useClass: Repository },
          { provide: IncomeSourceService, useValue: {
                  seeds: jest.fn(),
                  findOne: jest.fn(),
                  createToSheet: jest.fn(),
                  treatEntityParam: jest.fn(),
          }}
      ],
    }).compile();

    service = module.get<IncomeService>(IncomeService);
    repository = module.get<Repository<Income>>(getRepositoryToken(Income));
    sourceService = module.get<IncomeSourceService>(IncomeSourceService);
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
                received_at: mockEntity.received_at,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest
                .spyOn(service, 'save')
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
                received_at: mockEntity.received_at,
                description: mockEntity.description
            };

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest
                .spyOn(service, 'save')
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

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

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

        it('should update a income with all properties and save it', async () => {
            const updateDto: UpdateIncomeDto = {
                ...mockEntity,
                name: undefined,
            };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

            jest.spyOn(sourceService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.source);

            jest
                .spyOn(service, 'save')
                .mockResolvedValueOnce(mockEntity);

            expect(
                await service.update(mockEntity.finance, mockEntity.id, updateDto)
            ).toEqual(
                mockEntity,
            );
        });
    });

    describe('seeds', () => {
        it('should seed', async () => {
            jest.spyOn(sourceService, 'seeds').mockResolvedValueOnce([mockEntity.source]);

            jest.spyOn(service.seeder, 'getRelation').mockReturnValueOnce(mockEntity.source);


            jest.spyOn(service.seeder, 'entities').mockImplementation( async ({ createdEntityFn }: any) => {
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
            expect(await service.createToSheet(mockEntity.finance, {...mockEntity, name: undefined, source: undefined, received_at: undefined } as any)).toEqual(expected);
        });

        it('should return when income exist in database', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
            expect(await service.createToSheet(mockEntity.finance, mockEntity)).toEqual(mockEntity);
        })
    });
});
