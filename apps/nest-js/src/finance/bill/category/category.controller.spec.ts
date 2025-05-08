import { Test, type TestingModule } from '@nestjs/testing';

import { BILL_CATEGORY_MOCK } from '../../mocks/bill-category.mock';
import { type BillCategory } from '../../entities/category.entity';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { type CreateCategoryDto } from './dto/create-category.dto';
import { type UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockEntity: BillCategory =  BILL_CATEGORY_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
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

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return an list of bill categories', async () => {
      jest
          .spyOn(service, 'findAll')
          .mockResolvedValue([mockEntity]);

      expect(await controller.findAll({})).toEqual([mockEntity]);
    });
  });

  describe('create', () => {
    it('should create a new supplierType and save it', async () => {
      const createDto: CreateCategoryDto = {
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
    it('Should return a bill category', async () => {
      jest
          .spyOn(service, 'findOne')
          .mockResolvedValue(mockEntity);

      expect(
          await controller.findOne(mockEntity.name),
      ).toEqual(mockEntity);
    });
  });

  describe('update', () => {
    it('should update a bill category and save it', async () => {
      const updateDto: UpdateCategoryDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: BillCategory = {
        ...mockEntity,
        ...updateDto,
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(expected);

      expect(
          await controller.update(
              mockEntity.id,
              updateDto,
          ),
      ).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove a bill category when there are no associated bills', async () => {
      jest
          .spyOn(service, 'remove')
          .mockResolvedValueOnce({ message: 'Successfully removed' });

      expect(
          await controller.remove(mockEntity.id),
      ).toEqual({ message: 'Successfully removed' });
    });
  });
});
