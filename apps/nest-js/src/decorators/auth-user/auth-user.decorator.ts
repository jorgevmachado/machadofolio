import { createParamDecorator } from '@nestjs/common';

import { type User } from '../../auth/entities/user.entity';

export const GetUserAuth = createParamDecorator(
    (_, context): User => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);