import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { BANK_MOCK } from '../../../mocks/bank.mock';
import { type Bank } from '../../../entities/bank.entity';

import { type CreateBankDto } from './dto/create-bank.dto';
import { type UpdateBankDto } from './dto/update-bank.dto';

import { BankController } from './bank.controller';
import { BankService } from './bank.service';

describe('BankController', () => {
  let service: BankService;
  let controller: BankController;

  const mockEntity: Bank = BANK_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [
        {
          provide: BankService,
          useValue: {
            seed: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<BankService>(BankService);
    controller = module.get<BankController>(BankController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return an list of bank type', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockEntity]);

      expect(await controller.findAll({})).toEqual([mockEntity]);
    });
  });

  describe('create', () => {
    it('should create a new bank and save it', async () => {
      const createDto: CreateBankDto = {
        name: mockEntity.name,
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);

      expect(await controller.create(createDto)).toEqual(mockEntity);
    });
  });

  describe('findOne', () => {
    it('Should return  bank type', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEntity);

      expect(await controller.findOne(mockEntity.name)).toEqual(
          mockEntity,
      );
    });
  });

  describe('update', () => {
    it('should update a supplierType and save it', async () => {
      const updateDto: UpdateBankDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: Bank = {
        ...mockEntity,
        ...updateDto,
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(expected);

      expect(await controller.update(mockEntity.id, updateDto)).toEqual(
          expected,
      );
    });
  });

  describe('remove', () => {
    it('should remove SupplierType when there are no associated bank', async () => {
      jest
          .spyOn(service, 'remove')
          .mockResolvedValueOnce({ message: 'Successfully removed' });

      expect(await controller.remove(mockEntity.id)).toEqual({
        message: 'Successfully removed',
      });
    });
  });
});
