import type {
    ICreateGroupParams,
    IGroup,
    IPartialNestBaseEntity,
    IUpdateGroupParams
} from '../../api';

export type GroupEntity = IGroup

export type GroupConstructorParams = Omit< GroupEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateGroupParams = ICreateGroupParams;

export type UpdateGroupParams = IUpdateGroupParams;