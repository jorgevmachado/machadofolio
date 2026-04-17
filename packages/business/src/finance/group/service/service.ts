import { type Nest } from '../../../api';
import { BaseService } from '../../../shared';

import Group from '../group';
import type { CreateGroupParams, UpdateGroupParams } from '../types';

export class GroupService extends BaseService<Group, CreateGroupParams, UpdateGroupParams>{
    constructor(private nest: Nest) {
        super(nest.finance.group, (response) => new Group(response));
    }
}