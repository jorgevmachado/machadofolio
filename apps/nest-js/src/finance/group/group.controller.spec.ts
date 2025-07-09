import { Test, type TestingModule } from '@nestjs/testing';

import { GROUP_MOCK } from '../../mocks/group.mock';
import { USER_MOCK } from '../../mocks/user.mock';
import { type User } from '../../auth/entities/user.entity';

import { type Group } from '../entities/group.entity';

import { type CreateGroupDto } from './dto/create-group.dto';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { type UpdateGroupDto } from './dto/update-group.dto';

describe('GroupController', () => {
  let controller: GroupController;
  let service: GroupService;

  const mockEntity: Group =  GROUP_MOCK;
  const userMock: User = USER_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService,
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

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
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

      expect(await controller.findAll(userMock,{})).toEqual([mockEntity]);
    });
  });

  describe('create', () => {
    it('should create a new supplierType and save it', async () => {
      const createDto: CreateGroupDto = {
        name: mockEntity.name,
      };

      jest
          .spyOn(service, 'create')
          .mockResolvedValueOnce(mockEntity);

      expect(await controller.create(userMock, createDto)).toEqual(
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
          await controller.findOne(userMock, mockEntity.name),
      ).toEqual(mockEntity);
    });
  });

  describe('update', () => {
    it('should update a bill category and save it', async () => {
      const updateDto: UpdateGroupDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: Group = {
        ...mockEntity,
        ...updateDto,
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(expected);

      expect(
          await controller.update(
              userMock,
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
          await controller.remove(userMock, mockEntity.id),
      ).toEqual({ message: 'Successfully removed' });
    });
  });
});
