import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EXPENSE_MOCK } from '../../mocks/expense.mock';
import { SUPPLIER_MOCK } from '../../mocks/supplier.mock';
import { Supplier } from '../entities/supplier.entity';

import { type CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierService } from './supplier.service';
import { SupplierTypeService } from './type/type.service';
import { type UpdateSupplierDto } from './dto/update-supplier.dto';

describe('SupplierService', () => {
  let repository: Repository<Supplier>;
  let service: SupplierService;
  let supplierTypeService: SupplierTypeService;

  const mockEntity: Supplier = SUPPLIER_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          SupplierService,
        { provide: getRepositoryToken(Supplier), useClass: Repository },
        {
          provide: SupplierTypeService,
          useValue: {
            seeds: jest.fn(),
            findOne: jest.fn(),
            treatEntityParam: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
    supplierTypeService = module.get<SupplierTypeService>(SupplierTypeService);
    service = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(supplierTypeService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new supplier with supplier-type object and save it', async () => {
      const createDto: CreateSupplierDto = {
        name: mockEntity.name,
        type: mockEntity.type,
      };

      jest
          .spyOn(supplierTypeService, 'treatEntityParam')
          .mockResolvedValueOnce(mockEntity.type);

      jest
          .spyOn(repository, 'save')
          .mockResolvedValueOnce(mockEntity);

      expect(await service.create(createDto)).toEqual(
          mockEntity,
      );
    });

    it('should create a new supplier with supplier-type string and save it', async () => {
      const createDto: CreateSupplierDto = {
        name: mockEntity.name,
        type: mockEntity.type.name,
      };

      jest
          .spyOn(supplierTypeService, 'treatEntityParam')
          .mockResolvedValueOnce(mockEntity.type);

      jest
          .spyOn(repository, 'save')
          .mockResolvedValueOnce(mockEntity);

      expect(await service.create(createDto)).toEqual(
          mockEntity,
      );
    });
  });

  describe('update', () => {
    it('should update a supplier and save it', async () => {
      const updateDto: UpdateSupplierDto = {
        name: `${mockEntity.name}2`,
        type: mockEntity.type,
      };

      const expected: Supplier = {
        id: mockEntity.id,
        name: `${mockEntity.name}2`,
        type: mockEntity.type,
        name_code: `${mockEntity.name.toLowerCase()}_2`,
        created_at: mockEntity.created_at,
        updated_at: mockEntity.updated_at,
        deleted_at: mockEntity.deleted_at,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(mockEntity),
      } as any);

      jest
          .spyOn(supplierTypeService, 'treatEntityParam')
          .mockResolvedValueOnce(mockEntity.type);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expected);

      expect(
          await service.update(mockEntity.id, updateDto),
      ).toEqual(expected);
    });
    it('should update a supplier without type in request', async () => {
      const updateDto: UpdateSupplierDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: Supplier = {
        id: mockEntity.id,
        name: `${mockEntity.name}2`,
        type: mockEntity.type,
        name_code: `${mockEntity.name.toLowerCase()}_2`,
        created_at: mockEntity.created_at,
        updated_at: mockEntity.updated_at,
        deleted_at: mockEntity.deleted_at,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(mockEntity),
      } as any);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expected);

      expect(
          await service.update(mockEntity.id, updateDto),
      ).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove Supplier when there are no associated suppliers', async () => {
      const expected: Supplier = {
        ...mockEntity,
        expenses: [],
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

      expect(await service.remove(mockEntity.id)).toEqual({
        message: 'Successfully removed',
      });
    });

    it('should throw a ConflictException when Supplier is in use', async () => {
      const expected: Supplier = {
        ...mockEntity,
        expenses: [EXPENSE_MOCK],
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        andWhere: jest.fn(),
        withDeleted: jest.fn(),
        leftJoinAndSelect: jest.fn(),
        getOne: jest.fn().mockReturnValueOnce(expected),
      } as any);

      await expect(
          service.remove(mockEntity.type.id),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('seeds', () => {
    it('should seed the database when exist in database', async () => {
      jest.spyOn(supplierTypeService, 'seeds').mockResolvedValueOnce([mockEntity.type]);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([mockEntity]);

      expect(await service.seeds({
        supplierListJson: [mockEntity],
        supplierTypeListJson: [mockEntity.type],
      })).toEqual({
        supplierList: [mockEntity],
        supplierTypeList: [mockEntity.type]
      });
    });

    it('should seed the database when not exist in database', async () => {
      jest.spyOn(supplierTypeService, 'seeds').mockResolvedValueOnce([mockEntity.type]);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(supplierTypeService, 'treatEntityParam').mockResolvedValueOnce(mockEntity.type);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);
      expect(await service.seeds({
        supplierListJson: [mockEntity],
        supplierTypeListJson: [mockEntity.type],
      })).toEqual({
        supplierList: [mockEntity],
        supplierTypeList: [mockEntity.type]
      });
    });

    it('should return conflict Exception because dont exist one SupplierType in dataBase', async () => {
      jest
          .spyOn(supplierTypeService, 'seeds')
          .mockResolvedValueOnce(
              [{
                ...mockEntity.type,
                name: 'Not Exist'
              }]
          );

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      await expect(service.seeds({
        supplierListJson: [mockEntity],
        supplierTypeListJson: [mockEntity.type],
      })).rejects.toThrowError(ConflictException);
    });
  });
});
