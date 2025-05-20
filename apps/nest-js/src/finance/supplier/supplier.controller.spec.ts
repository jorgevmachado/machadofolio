import { Test, type TestingModule } from '@nestjs/testing';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';

import { SUPPLIER_MOCK } from '../../mocks/supplier.mock';
import { type Supplier } from '../entities/supplier.entity';

import { type CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { type UpdateSupplierDto } from './dto/update-supplier.dto';


describe('SupplierController', () => {
  let controller: SupplierController;
  let service: SupplierService;

  const mockEntity: Supplier = SUPPLIER_MOCK

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            seed: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return an list of suppliers', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockEntity],);

      expect(await controller.findAll({})).toEqual([mockEntity],);
    });
  });

  describe('create', () => {
    it('should create a new supplier and save it', async () => {
      const createDto: CreateSupplierDto = {
        name: mockEntity.name,
        type: mockEntity.type,
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
    it('Should return one supplier', async () => {
      jest
          .spyOn(service, 'findOne')
          .mockResolvedValue(mockEntity);

      expect(
          await controller.findOne(mockEntity.name),
      ).toEqual(mockEntity);
    });
  });

  describe('update', () => {
    it('should update a supplier and save it', async () => {
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

      jest.spyOn(service, 'update').mockResolvedValueOnce(expected);

      expect(
          await controller.update(mockEntity.id, updateDto),
      ).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove Supplier when there are no associated expenses', async () => {
      jest
          .spyOn(service, 'remove')
          .mockResolvedValueOnce({ message: 'Successfully removed' });

      expect(await controller.remove(mockEntity.id)).toEqual(
          { message: 'Successfully removed' },
      );
    });
  });
});
