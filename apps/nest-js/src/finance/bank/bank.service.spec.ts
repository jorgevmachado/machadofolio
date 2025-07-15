import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
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
  });

  describe('create', () => {
    it('should create a new bank and save it', async () => {
      const createDto: CreateBankDto = {
        name: mockEntity.name,
      };

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      expect(await service.create(createDto)).toEqual(mockEntity);
    });

    it('should return conflict exception when try to create a new bank', async () => {
      const createDto: CreateBankDto = {
        name: mockEntity.name,
      };

      jest
          .spyOn(repository, 'save')
          .mockRejectedValueOnce(new ConflictException());

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

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(mockEntity),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expected);

      expect(await service.update(mockEntity.id, updateDto)).toEqual(
          expected,
      );
    });
  });

  describe('seeds', () => {
    it('should seed the database when exist in database', async () => {
      jest
          .spyOn(repository, 'find')
          .mockResolvedValueOnce([mockEntity]);

      expect(await service.seeds({ bankListJson: [mockEntity] })).toEqual([mockEntity]);
    });

    it('should seed the database when not exist in database', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      expect(await service.seeds({ bankListJson: [mockEntity] })).toEqual([mockEntity]);
    });

    it('Should return a seed empty when received a empty list', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      expect(await service.seeds({})).toEqual([]);
    });
  });
});
