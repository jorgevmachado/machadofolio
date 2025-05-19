import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BILL_CATEGORY_MOCK } from '../../../mocks/bill-category.mock';
import { BILL_MOCK } from '../../../mocks/bill.mock';
import { BillCategory } from '../../entities/category.entity';

import { CategoryService } from './category.service';
import { type CreateCategoryDto } from './dto/create-category.dto';
import { type UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let repository: Repository<BillCategory>;
  let service: CategoryService;
  
  const mockEntity: BillCategory =  BILL_CATEGORY_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          CategoryService,
        { provide: getRepositoryToken(BillCategory), useClass: Repository },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<BillCategory>>(
        getRepositoryToken(BillCategory),
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
    it('should create a new billCategory and save it', async () => {
      const createDto: CreateCategoryDto = {
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
    it('should update a billCategory and save it', async () => {
      const updateDto: UpdateCategoryDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: BillCategory = {
        ...mockEntity,
        ...updateDto,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        getOne: jest
            .fn()
            .mockReturnValueOnce(mockEntity),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expected);

      expect(
          await service.update(
              mockEntity.id,
              updateDto,
          ),
      ).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove billCategory when there are no associated bills', async () => {
      const expected: BillCategory = {
        ...mockEntity,
        bills: [],
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(expected),
      } as any);

      jest.spyOn(repository, 'softRemove').mockResolvedValueOnce({
        ...expected,
        deleted_at: mockEntity.created_at,
      });

      expect(
          await service.remove(mockEntity.id),
      ).toEqual({
        message: 'Successfully removed',
      });
    });

    it('should throw a ConflictException when billCategory is in use', async () => {
      const expected: BillCategory = {
        ...mockEntity,
        bills: [BILL_MOCK],
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(expected),
      } as any);

      await expect(
          service.remove(mockEntity.id),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('seeds', () => {
    it('should seed the database when exist in database', async () => {
      jest
          .spyOn(repository, 'find')
          .mockResolvedValueOnce([mockEntity]);

      expect(await service.seeds([mockEntity])).toEqual([mockEntity]);
    });

    it('should seed the database when not exist in database', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      expect(await service.seeds([mockEntity])).toEqual([mockEntity]);
    });

    it('Should return a seed empty when received a empty list', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      expect(await service.seeds([])).toEqual([]);
    });
  });
});
