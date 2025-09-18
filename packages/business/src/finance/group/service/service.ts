import { BaseService } from '../../../shared';

import { type Nest } from '../../../api';

import type { CreateGroupParams, UpdateGroupParams } from '../types';
import Group from '../group';

export class GroupService extends BaseService<Group, CreateGroupParams, UpdateGroupParams>{
    constructor(private nest: Nest) {
        super(nest.finance.group, (response) => new Group(response));
    }
}