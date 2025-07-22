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

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
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
            createToSheet: jest.fn(),
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

      jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

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

      jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

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

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

      jest
          .spyOn(supplierTypeService, 'treatEntityParam')
          .mockResolvedValueOnce(mockEntity.type);

      jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

      expect(
          await service.update(mockEntity.id, updateDto),
      ).toEqual(expected);
    });

    it('should update a supplier without type and name in request', async () => {

      const expected: Supplier = {
        id: mockEntity.id,
        name: `${mockEntity.name}`,
        type: mockEntity.type,
        name_code: `${mockEntity.name.toLowerCase()}_2`,
        created_at: mockEntity.created_at,
        updated_at: mockEntity.updated_at,
        deleted_at: mockEntity.deleted_at,
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

      jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

      expect(
          await service.update(mockEntity.id, {}),
      ).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove Supplier when there are no associated suppliers', async () => {
      const expected: Supplier = {
        ...mockEntity,
        expenses: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

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

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(expected);
      jest.spyOn(service, 'error').mockImplementationOnce(() => { throw new ConflictException(); });

      await expect(
          service.remove(mockEntity.type.id),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('seeds', () => {
    it('should seed', async () => {
      jest.spyOn(supplierTypeService, 'seeds').mockResolvedValueOnce([mockEntity.type]);

      jest.spyOn(service.seeder, 'getRelation').mockReturnValueOnce(mockEntity.type);


      jest.spyOn(service.seeder, 'entities').mockImplementation( async ({ createdEntityFn }: any) => {
        createdEntityFn(mockEntity);
        return [mockEntity];
      });

      expect(await service.seeds({
        supplierListJson: [mockEntity],
        supplierTypeListJson: [mockEntity.type],
      })).toEqual({
        supplierList: [mockEntity],
        supplierTypeList: [mockEntity.type]
      });
    });
  });

  describe('createToSheet', () => {
    it('should return NotFoundException when value is undefined.', async () => {
      await expect(service.createToSheet(undefined)).rejects.toThrowError(NotFoundException);
    });

    it('should return NotFoundException when value is "".', async () => {
      await expect(service.createToSheet('')).rejects.toThrowError(NotFoundException);
    });

    it('should return when supplier exist in database.', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
      expect(await service.createToSheet(mockEntity.name)).toEqual(mockEntity);
    });

    it('should return when supplier not exist in database.', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(supplierTypeService, 'createToSheet').mockResolvedValueOnce(mockEntity.type);
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);
      expect(await service.createToSheet(mockEntity.name)).toEqual(mockEntity);
    })
  });
});
