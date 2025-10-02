import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { INCOME_SOURCE_MOCK } from '../../../mocks/income-source.mock';

import { type IncomeSource } from '../../entities/income-source.entity';

import type { CreateTypeDto } from '../../supplier/type/dto/create-type.dto';

import { IncomeSourceService } from './source.service';
import { SourceController } from './source.controller';

import { type UpdateSourceDto } from './dto/update-source.dto';

describe('SourceController', () => {
  let controller: SourceController;
  let service: IncomeSourceService;

  const mockEntity: IncomeSource = INCOME_SOURCE_MOCK  as unknown as IncomeSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourceController],
      providers: [ {
          provide: IncomeSourceService,
          useValue: {
              findAll: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              remove: jest.fn(),
              findOne: jest.fn(),
              seed: jest.fn(),
          }
      }],
    }).compile();

    controller = module.get<SourceController>(SourceController);
    service = module.get<IncomeSourceService>(IncomeSourceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('Should return an list of income source', async () => {
            jest
                .spyOn(service, 'findAll')
                .mockResolvedValue([mockEntity]);

            expect(await controller.findAll({})).toEqual([mockEntity]);
        });
    });

    describe('create', () => {
        it('should create a new supplierType and save it', async () => {
            const createDto: CreateTypeDto = {
                name: mockEntity.name,
            };

            jest
                .spyOn(service, 'create')
                .mockResolvedValueOnce(mockEntity);

            expect(await controller.create(createDto)).toEqual(
                mockEntity,
            );
        });
    });

    describe('findOne', () => {
        it('Should return  income source', async () => {
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValue(mockEntity);

            expect(
                await controller.findOne(mockEntity.name),
            ).toEqual(mockEntity);
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

            jest.spyOn(service, 'update').mockResolvedValueOnce(expected);

            expect(
                await controller.update(mockEntity.id, updateDto),
            ).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should remove IncomeSource when there are no associated suppliers', async () => {
            jest
                .spyOn(service, 'remove')
                .mockResolvedValueOnce({ message: 'Successfully removed' });

            expect(await controller.remove(mockEntity.id)).toEqual(
                { message: 'Successfully removed' },
            );
        });
    });
});
