import { describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { INCOME_MOCK } from '../../mocks/income.mock';
import { USER_MOCK } from '../../mocks/user.mock';
import { Income } from '../entities/incomes.entity';

import { User } from '../../auth/entities/user.entity';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

describe('IncomeController', () => {
  let controller: IncomeController;
  let service: IncomeService;

  const mockEntity: Income = INCOME_MOCK as unknown as Income;
  const mockUser: User = USER_MOCK as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeController],
      providers: [
          {
              provide: IncomeService,
              useValue: {
                  seed: jest.fn(),
                  findAll: jest.fn(),
                  findOne: jest.fn(),
                  create: jest.fn(),
                  update: jest.fn(),
                  remove: jest.fn(),
              }
          }
      ],
    }).compile();

    controller = module.get<IncomeController>(IncomeController);
    service = module.get<IncomeService>(IncomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

    describe('findAll', () => {
        it('Should return an list of income', async () => {
            jest
                .spyOn(service, 'findAll')
                .mockResolvedValue([mockEntity]);

            expect(await controller.findAll(mockUser,{})).toEqual([mockEntity]);
        });
    });

    describe('findOne', () => {
        it('Should return a income', async () => {
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValue(mockEntity);

            expect(
                await controller.findOne(mockUser, mockEntity.name),
            ).toEqual(mockEntity);
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

            jest
                .spyOn(service, 'create')
                .mockResolvedValueOnce(mockEntity);

            expect(await controller.create(mockUser, createDto)).toEqual(
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
                ...updateDto,
                source: mockEntity.source
            }

            jest.spyOn(service, 'update').mockResolvedValueOnce(expected);

            expect(
                await controller.update(mockUser, mockEntity.id, updateDto)
            ).toEqual(
                expected,
            );
        });
    });

    describe('remove', () => {
        it('should remove a income', async () => {
            jest
                .spyOn(service, 'remove')
                .mockResolvedValueOnce({ message: 'Successfully removed' });

            expect(
                await controller.remove(mockUser, mockEntity.id),
            ).toEqual({ message: 'Successfully removed' });
        });
    });
});
