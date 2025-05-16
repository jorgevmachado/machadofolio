import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { SUPPLIER_TYPE_MOCK } from '../../../../../mocks/supplier-type.mock';
import { type SupplierType } from '../../../../entities/type.entity';

import { type CreateTypeDto } from './dto/create-type.dto';
import { SupplierTypeService } from './type.service';
import { TypeController } from './type.controller';
import { type UpdateTypeDto } from './dto/update-type.dto';

describe('TypeController', () => {
  let controller: TypeController;
  let service: SupplierTypeService;

  const mockEntity: SupplierType = SUPPLIER_TYPE_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        {
          provide: SupplierTypeService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
            seed: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TypeController>(TypeController);
    service = module.get<SupplierTypeService>(SupplierTypeService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return an list of suppliers type', async () => {
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
    it('Should return  suppliers type', async () => {
      jest
          .spyOn(service, 'findOne')
          .mockResolvedValue(mockEntity);

      expect(
          await controller.findOne(mockEntity.name),
      ).toEqual(mockEntity);
    });
  });

  describe('update', () => {
    it('should update a supplierType and save it', async () => {
      const updateDto: UpdateTypeDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: SupplierType = {
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
    it('should remove SupplierType when there are no associated suppliers', async () => {
      jest
          .spyOn(service, 'remove')
          .mockResolvedValueOnce({ message: 'Successfully removed' });

      expect(await controller.remove(mockEntity.id)).toEqual(
          { message: 'Successfully removed' },
      );
    });
  });
});
