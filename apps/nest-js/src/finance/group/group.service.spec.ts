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
          .spyOn(repository, 'save')
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

    it('should throw a ConflictException when group is in use', async () => {
      const expected: Group = {
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

      expect(await service.seeds({ finance: mockEntity.finance, groupListJson: [mockEntity]})).toEqual([mockEntity]);
    });

    it('should seed the database when not exist in database', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

      expect(await service.seeds({ finance: mockEntity.finance, groupListJson: [mockEntity]})).toEqual([mockEntity]);
    });

    it('Should return a seed empty when received a empty list', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      expect(await service.seeds({ finance: mockEntity.finance, })).toEqual([]);
    });
  });
});
