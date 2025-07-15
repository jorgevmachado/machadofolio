import { SetMetadata } from '@nestjs/common';

import { type ERole } from '@repo/business';

export const AuthRoles = (...roles: Array<ERole>) => SetMetadata('role', roles);
