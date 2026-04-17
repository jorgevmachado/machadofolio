import { type User } from '../../auth/entities/user.entity';

import { createParamDecorator } from '@nestjs/common';

export const GetUserAuth = createParamDecorator(
    (_, context): User => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);