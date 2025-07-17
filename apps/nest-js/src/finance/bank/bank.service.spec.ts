jest.mock('../../shared', () => {
  class ServiceMock {
    save = jest.fn();
    seeder = {
      entities: jest.fn(),
    };
    findOne = jest.fn();
  }
  return { Service: ServiceMock }
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BANK_MOCK } from '../../mocks/bank.mock';
import { Bank } from '../entities/bank.entity';

import { BankService } from './bank.service';
import { type CreateBankDto } from './dto/create-bank.dto';
import { type UpdateBankDto } from './dto/update-bank.dto';

describe('BankService', () => {
  let service: BankService;
  let repository: Repository<Bank>;
  const mockEntity: Bank = BANK_MOCK

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          BankService,
        { provide: getRepositoryToken(Bank), useClass: Repository },
      ],
    }).compile();

    service = module.get<BankService>(BankService);
    repository = module.get<Repository<Bank>>(getRepositoryToken(Bank));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect((service as any).repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new bank and save it', async () => {
      const createDto: CreateBankDto = {
        name: mockEntity.name,
      };

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
      jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

      expect(await service.create(createDto)).toEqual(mockEntity);
    });

    it('should return conflict exception when try to create a new bank', async () => {
      const createDto: CreateBankDto = {
        name: mockEntity.name,
      };

      jest.spyOn(service, 'save').mockImplementationOnce(() => { throw new ConflictException(); })

      await expect(service.create(createDto)).rejects.toThrowError(
          ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a bank and save it', async () => {
      const updateDto: UpdateBankDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: Bank = {
        ...mockEntity,
        ...updateDto,
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

      jest.spyOn(service, 'save').mockResolvedValueOnce(expected);


      expect(await service.update(mockEntity.id, updateDto)).toEqual(
          expected,
      );
    });
  });

  describe('seeds', () => {
    it('should seed', async () => {
      jest.spyOn(service.seeder, 'entities').mockImplementation( async ({ createdEntityFn }: any) => {
        createdEntityFn(mockEntity);
        return [mockEntity];
      });

      expect(await service.seeds({ bankListJson: [mockEntity] })).toEqual([mockEntity]);
    });
  });

  describe('createToSheet', () => {
    it('should return NotFoundException when value is undefined.', async () => {
      await expect(service.createToSheet(undefined)).rejects.toThrowError(NotFoundException);
    });

    it('should return NotFoundException when value is "".', async () => {
      await expect(service.createToSheet('')).rejects.toThrowError(NotFoundException);
    });

    it('should return when bank exist in database.', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
      expect(await service.createToSheet(mockEntity.name)).toEqual(mockEntity);
    });

    it('should return when bank not exist in database.', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);
      expect(await service.createToSheet(mockEntity.name)).toEqual(mockEntity);
    })
  });
});
