jest.mock('../../shared', () => {
  class ServiceMock {
    save = jest.fn();
    error = jest.fn();
    seeder = {
      entities: jest.fn(),
    };
    findOne = jest.fn();
  }
  return { Service: ServiceMock }
});
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BILL_MOCK } from '../../mocks/bill.mock';
import { GROUP_MOCK } from '../../mocks/group.mock';
import { Group } from '../entities/group.entity';

import { type CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { type UpdateGroupDto } from './dto/update-group.dto';

describe('GroupService', () => {
  let repository: Repository<Group>;
  let service: GroupService;
  
  const mockEntity: Group =  GROUP_MOCK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          GroupService,
        { provide: getRepositoryToken(Group), useClass: Repository },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    repository = module.get<Repository<Group>>(
        getRepositoryToken(Group),
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
    it('should create a new group and save it', async () => {
      const createDto: CreateGroupDto = {
        name: mockEntity.name,
      };

      jest
          .spyOn(service, 'save')
          .mockResolvedValueOnce(mockEntity);

      expect(await service.create(mockEntity.finance, createDto)).toEqual(
          mockEntity,
      );
    });
  });

  describe('update', () => {
    it('should update a group and save it', async () => {
      const updateDto: UpdateGroupDto = {
        name: `${mockEntity.name}2`,
      };

      const expected: Group = {
        ...mockEntity,
        ...updateDto,
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

      jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

      expect(
          await service.update(
              mockEntity.finance,
              mockEntity.id,
              updateDto,
          ),
      ).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove group when there are no associated bills', async () => {
      const expected: Group = {
        ...mockEntity,
        bills: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(expected);

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

    it('should throw a ConflictException when group is in use', async () => {
      const expected: Group = {
        ...mockEntity,
        bills: [BILL_MOCK],
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(expected);
      jest.spyOn(service, 'error').mockImplementationOnce(() => { throw new ConflictException(); });


      await expect(
          service.remove(mockEntity.id),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('seeds', () => {
    it('should seed the database when exist in database', async () => {
      jest
          .spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
            createdEntityFn(mockEntity);
            return [mockEntity];
      })

      expect(await service.seeds({ finances: [mockEntity.finance], groupListJson: [mockEntity]})).toEqual([mockEntity]);
    });

    it('should not seed when finances is not found in list of finances', async () => {
      jest
          .spyOn(service.seeder, 'entities').mockImplementation(async ({ createdEntityFn }: any) => {
        createdEntityFn(mockEntity);
        return [];
      })

      expect(await service.seeds({ finances: [{ ...mockEntity.finance, id: '1234' }], groupListJson: [mockEntity]})).toEqual([]);
    });
  });

  describe('createToSheet', () => {
    it('should create group when not found in database', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);
      expect(await service.createToSheet(mockEntity.finance, mockEntity.name)).toEqual(mockEntity);
    });

    it('should return when group exist in database', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
      expect(await service.createToSheet(mockEntity.finance, mockEntity.name)).toEqual(mockEntity);
    })
  });
});
